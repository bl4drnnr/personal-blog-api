import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from '@models/project.model';
import { CreateProjectRequest } from '@projects/dto/create-project/request.dto';
import { UpdateProjectRequest } from '@projects/dto/update-project/request.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectRepository: typeof Project
  ) {}

  async getProjectBySlug({
    slug,
    language
  }: {
    slug: string;
    language: string;
  }) {
    return await this.projectRepository.findOne({
      where: { slug, language }
    });
  }

  async getProjectById({ id }: { id: string }) {
    return await this.projectRepository.findByPk(id);
  }

  async createProject({ project }: { project: CreateProjectRequest }) {
    return await this.projectRepository.create(project);
  }

  async updateProject({
    id,
    project
  }: {
    id: string;
    project: UpdateProjectRequest;
  }) {
    return await this.projectRepository.update(
      {
        ...project
      },
      { where: { id } }
    );
  }

  async deleteProject({ id }: { id: string }) {
    return await this.projectRepository.destroy({ where: { id } });
  }
}
