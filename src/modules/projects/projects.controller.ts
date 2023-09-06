import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ProjectsService } from '@projects/projects.service';
import { CreateProjectDto } from '@dto/create-project.dto';
import { UpdateProjectDto } from '@dto/update-project.dto';
import { AuthGuard } from '@guards/jwt.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('get-by-slug')
  async getProjectBySlug(
    @Query('slug') slug: string,
    @Query('language') language: string
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

  @Get('get-all-slugs')
  getAllSlugs() {
    return this.projectsService.getAllSlugs();
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createProject(@Body() project: CreateProjectDto) {
    return await this.projectsService.createProject(project);
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  async updateProject(
    @Query('id') id: string,
    @Body() project: UpdateProjectDto
  ) {
    return await this.projectsService.updateProject({ id, project });
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  async deleteProject(@Query('id') id: string) {
    return await this.projectsService.deleteProject({ id });
  }
}
