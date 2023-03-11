import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { ProjectsService } from '@projects/projects.service';
import { JwtGuard } from '@guards/jwt.guard';
import { CreateProjectRequest } from '@projects/dto/create-project/request.dto';
import { UpdateProjectRequest } from '@projects/dto/update-project/request.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':slug')
  async getProjectBySlug(@Param('slug') slug: string) {
    return await this.projectsService.getProjectBySlug({ slug });
  }

  @Get('id/:id')
  async getProjectById(@Param('id') id: string) {
    return await this.projectsService.getProjectById({ id });
  }

  @UseGuards(JwtGuard)
  @Post()
  async createProject(@Body() project: CreateProjectRequest) {
    return await this.projectsService.createProject({ project });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() project: UpdateProjectRequest
  ) {
    return await this.projectsService.updateProject({ id, project });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return await this.projectsService.deleteProject({ id });
  }
}
