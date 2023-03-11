import { Controller, Get, Param } from '@nestjs/common';
import { ProjectsService } from '@projects/projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':slug')
  async getProjectBySlug(@Param('slug') slug: string) {
    return await this.projectsService.getProjectBySlug({ slug });
  }
}
