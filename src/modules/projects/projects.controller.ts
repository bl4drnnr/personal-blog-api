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
import { UpdateProjectDto } from '@dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Public endpoints for frontend
  @Get('projects/slugs')
  async getProjectsSlugs() {
    return this.projectsService.getSlugs();
  }

  @Get('projects/:slug')
  async getProjectBySlug(@Param('slug') slug: string) {
    return this.projectsService.getProjectBySlug({ slug });
  }

  @Get('projects')
  async getProjectsPage(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string
  ) {
    return this.projectsService.getProjectsPageData({ page, limit, search });
  }

  // Admin endpoints
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/list-projects')
  async getAdminProjects(
    @UserId() userId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('published') published?: string,
    @Query('query') query?: string,
    @Query('orderBy') orderBy?: string
  ) {
    return await this.projectsService.getAdminProjects({
      userId,
      page,
      pageSize,
      order,
      published,
      query,
      orderBy
    });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/create-project')
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
  @Put('admin/edit-project')
  async updateProject(
    @Body() data: UpdateProjectDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.projectsService.update({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/delete-project')
  async deleteProject(
    @Query('id') projectId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.projectsService.delete({ projectId, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-project')
  async getProjectForAdmin(@Query('slug') slug: string) {
    return this.projectsService.getProjectBySlugForAdmin({ slug });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Put('admin/change-project-public-status')
  async togglePublishStatus(
    @Query('id') projectId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.projectsService.togglePublished({ projectId, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Put('admin/change-project-featured-status')
  async toggleFeaturedStatus(
    @Query('id') projectId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.projectsService.toggleFeatured({ projectId, trx });
  }
}
