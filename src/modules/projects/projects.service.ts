import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from '@models/project.model';
import sequelize, { Op } from 'sequelize';
import { CreateProjectDto } from '@dto/create-project.dto';
import { UpdateProjectDto } from '@dto/update-project.dto';
import { ApiConfigService } from '@shared/config.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly configService: ApiConfigService,
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
    orderBy,
    searchQuery
  }: {
    language: string;
    page: number;
    pageSize: number;
    order: string;
    orderBy: string;
    searchQuery: string;
  }) {
    const offset = page * pageSize;
    const limit = pageSize;

    const orderByOptions = process.env.ORDER_BY_OPTIONS.split(',');
    const orderOptions = process.env.ORDER_OPTIONS.split(',');

    if (!orderByOptions.includes(orderBy) || !orderOptions.includes(order))
      throw new BadRequestException();

    const where = {};

    if (searchQuery) {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${searchQuery}%`
          }
        },
        sequelize.where(
          sequelize.fn('array_to_string', sequelize.col('project_tags'), ','),
          'ILIKE',
          `%${searchQuery}%`
        )
      ];
    }

    return await this.projectRepository.findAndCountAll({
      attributes: [''],
      where: { language, ...where },
      order: [[order, orderBy]],
      limit,
      offset
    });
  }

  async getAllSlugs() {
    const allSlugs = await this.projectRepository.findAll({
      attributes: ['slug']
    });
    return allSlugs.map(({ slug }) => slug);
  }

  async createProject(project: CreateProjectDto) {
    return await this.projectRepository.create(project);
  }

  async updateProject({
    id,
    project
  }: {
    id: string;
    project: UpdateProjectDto;
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

  async getAvailableLanguages() {
    return this.configService.getAvailableLanguages;
  }
}
