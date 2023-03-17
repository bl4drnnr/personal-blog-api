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

  @Get('get-by-id')
  async getProjectById(@Query('id') id: string) {
    return await this.projectsService.getProjectById({ id });
  }

  @Get('all')
  async getAllProjects(
    @Query('language') language: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
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
  @Post('create')
  async createProject(@Body() project: CreateProjectRequest) {
    return await this.projectsService.createProject({ project });
  }

  @UseGuards(JwtGuard)
  @Patch('update')
  async updateProject(
    @Query('id') id: string,
    @Body() project: UpdateProjectRequest
  ) {
    return await this.projectsService.updateProject({ id, project });
  }

  @UseGuards(JwtGuard)
  @Delete('delete')
  async deleteProject(@Query('id') id: string) {
    return await this.projectsService.deleteProject({ id });
  }
}
