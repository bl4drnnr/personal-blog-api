import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from '@models/project.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectRepository: typeof Project
  ) {}

  async getProjectBySlug({ slug }: { slug: string }) {
    console.log('project slug', slug);
    return await this.projectRepository.findOne({
      where: { slug }
    });
  }
}
