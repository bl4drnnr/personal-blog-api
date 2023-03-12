import { BadRequestException, Injectable } from '@nestjs/common';
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

  async getAllProjects({
    language,
    page,
    pageSize,
    order,
    orderBy
  }: {
    language: string;
    page: number;
    pageSize: number;
    order: string;
    orderBy: string;
  }) {
    const offset = page * pageSize;
    const limit = pageSize;

    if (!['desc', 'asc'].includes(order)) throw new BadRequestException();

    if (!['created_at', 'title'].includes(orderBy))
      throw new BadRequestException();

    return await this.projectRepository.findAndCountAll({
      where: { language },
      order: [[order, order.toUpperCase()]],
      limit,
      offset
    });
  }

  async searchProjects({
    searchString,
    language
  }: {
    searchString: string;
    language: string;
  }) {
    //
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
