import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectModel } from '@models/project.model';
import { ProjectNotFoundException } from '@exceptions/projects/project-not-found.exception';
import { CreateProjectInterface } from '@interfaces/create-project.interface';
import { GetProjectBySlugInterface } from '@interfaces/get-project-by-slug.interface';
import { GetProjectsSlugsInterface } from '@interfaces/get-projects-slugs.interface';
import { UpdateProjectInterface } from '@interfaces/update-project.interface';
import { DeleteProjectInterface } from '@interfaces/delete-project.interface';
import { GetProjectsByUserInterface } from '@interfaces/get-projects-by-user.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(ProjectModel)
    private readonly projectModel: typeof ProjectModel
  ) {}

  async create(payload: CreateProjectInterface) {
    const { data, userId, trx } = payload;

    return await this.projectModel.create(
      {
        ...data,
        userId
      },
      { transaction: trx }
    );
  }

  async findAll() {
    return await this.projectModel.findAll({
      where: { published: true },
      order: [['createdAt', 'DESC']]
    });
  }

  async getProjectBySlug({ slug }: GetProjectBySlugInterface) {
    const project = await this.projectModel.findOne({
      where: { slug }
    });

    if (!project || !project.published) {
      throw new ProjectNotFoundException();
    }

    return {
      slug: project.slug,
      title: project.title,
      description: project.description,
      content: project.content,
      date: project.createdAt,
      tags: project.tags || [],
      featuredImage: project.featuredImage,
      technologies: project.technologies || [],
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      featured: project.featured,
      published: project.published
    };
  }

  async findFeatured() {
    return await this.projectModel.findAll({
      where: { featured: true, published: true },
      order: [['createdAt', 'DESC']]
    });
  }

  async getSlugs(): Promise<GetProjectsSlugsInterface[]> {
    const projects = await this.projectModel.findAll({
      where: { published: true },
      attributes: ['slug', 'title', 'description', 'createdAt', 'tags'],
      order: [['createdAt', 'DESC']]
    });

    return projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      description: project.description,
      date: project.createdAt,
      tags: project.tags || []
    }));
  }

  async update(payload: UpdateProjectInterface) {
    const { projectId, data, trx } = payload;

    const [updatedRowsCount] = await this.projectModel.update(data, {
      where: { id: projectId },
      transaction: trx
    });

    if (updatedRowsCount === 0) {
      throw new ProjectNotFoundException();
    }

    return await this.projectModel.findByPk(projectId, { transaction: trx });
  }

  async delete(payload: DeleteProjectInterface) {
    const { projectId, trx } = payload;

    const deletedRowsCount = await this.projectModel.destroy({
      where: { id: projectId },
      transaction: trx
    });

    if (deletedRowsCount === 0) {
      throw new ProjectNotFoundException();
    }

    return { message: 'Project deleted successfully' };
  }

  async findByUserId({ userId }: GetProjectsByUserInterface) {
    return await this.projectModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  }
}
