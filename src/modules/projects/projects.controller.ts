import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from '@dto/create-project.dto';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { UserId } from '@decorators/user-id.decorator';
import { Transaction } from 'sequelize';
import { BasicAuthGuard } from '@guards/basic-auth.guard';

interface ProjectsQuery {
  page?: string;
  limit?: string;
  search?: string;
}

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Public endpoints for frontend
  @Get('projects')
  async getProjectsPage(@Query() query: ProjectsQuery) {
    const { page, limit, search } = query;

    return this.projectsService.getProjectsPageData({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 12,
      search
    });
  }

  @Get('projects/slugs')
  async getProjectsSlugs() {
    return this.projectsService.getSlugs();
  }

  @Get('projects/:slug')
  async getProjectBySlug(@Param('slug') slug: string) {
    return this.projectsService.getProjectBySlug({ slug });
  }

  @Get('projects/featured')
  async getFeaturedProjects() {
    return this.projectsService.findFeatured();
  }

  // Admin endpoints
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/projects')
  async getAdminProjects(@UserId() userId: string) {
    return this.projectsService.findByUserId({ userId });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/projects')
  async createProject(
    @Body() data: CreateProjectDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.projectsService.create({ data, userId, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/projects/:id')
  async updateProject(
    @Param('id') projectId: string,
    @Body() data: Partial<CreateProjectDto>,
    @TrxDecorator() trx: Transaction
  ) {
    return this.projectsService.update({ projectId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/projects/:id')
  async deleteProject(
    @Param('id') projectId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.projectsService.delete({ projectId, trx });
  }
}
