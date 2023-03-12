import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ProjectsService } from '@projects/projects.service';
import { JwtGuard } from '@guards/jwt.guard';
import { CreateProjectRequest } from '@projects/dto/create-project/request.dto';
import { UpdateProjectRequest } from '@projects/dto/update-project/request.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':language/:slug')
  async getProjectBySlug(
    @Param('slug') slug: string,
    @Param('language') language: string
  ) {
    return await this.projectsService.getProjectBySlug({ slug, language });
  }

  @Get('id/:id')
  async getProjectById(@Param('id') id: string) {
    return await this.projectsService.getProjectById({ id });
  }

  @Get('all/:language/:page/:pageSize/:order/:orderBy')
  async getAllProjects(
    @Param('language') language: string,
    @Param('page') page: number,
    @Param('pageSize') pageSize: number,
    @Param('order') order: string,
    @Param('orderBy') orderBy: string,
    @Query('searchQuery') searchQuery: string
  ) {
    return await this.projectsService.getAllProjects({
      language,
      page,
      pageSize,
      order,
      orderBy,
      searchQuery
    });
  }

  @UseGuards(JwtGuard)
  @Post()
  async createProject(@Body() project: CreateProjectRequest) {
    return await this.projectsService.createProject({ project });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() project: UpdateProjectRequest
  ) {
    return await this.projectsService.updateProject({ id, project });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.deleteProject({ id });
  }
}
