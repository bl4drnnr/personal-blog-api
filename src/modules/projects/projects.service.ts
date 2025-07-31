import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProjectModel } from '@models/project.model';
import { ProjectsPage } from '@models/projects-page.model';
import { ProjectNotFoundException } from '@exceptions/projects/project-not-found.exception';
import { CreateProjectInterface } from '@interfaces/create-project.interface';
import { GetProjectBySlugInterface } from '@interfaces/get-project-by-slug.interface';
import { GetProjectsSlugsInterface } from '@interfaces/get-projects-slugs.interface';
import { UpdateProjectInterface } from '@interfaces/update-project.interface';
import { DeleteProjectInterface } from '@interfaces/delete-project.interface';
import { GetProjectsByUserInterface } from '@interfaces/get-projects-by-user.interface';
import { StaticAssetsService } from '../static-assets/static-assets.service';

interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(ProjectModel)
    private readonly projectModel: typeof ProjectModel,
    @InjectModel(ProjectsPage)
    private readonly projectsPageModel: typeof ProjectsPage,
    private readonly staticAssetsService: StaticAssetsService
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

  async getProjectsPageData(query: PaginationQuery = {}) {
    const { page = 1, limit = 12, search } = query;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions: any = {
      published: true
    };

    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const [projectsPage, { rows: projects, count: totalProjects }] =
      await Promise.all([
        this.projectsPageModel.findOne(),
        this.projectModel.findAndCountAll({
          where: whereConditions,
          order: [['createdAt', 'DESC']],
          limit,
          offset,
          attributes: [
            'id',
            'title',
            'slug',
            'description',
            'featuredImage',
            'tags',
            'featured',
            'createdAt',
            'updatedAt'
          ]
        })
      ]);

    if (!projectsPage) {
      throw new NotFoundException('Projects page content not found');
    }

    const totalPages = Math.ceil(totalProjects / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      pageContent: {
        title: projectsPage.title,
        subtitle: projectsPage.subtitle,
        description: projectsPage.description
      },
      layoutData: {
        footerText: projectsPage.footerText,
        heroImageMain: await this.getStaticAsset(projectsPage.heroImageMainId),
        heroImageSecondary: await this.getStaticAsset(
          projectsPage.heroImageSecondaryId
        ),
        heroImageMainAlt: projectsPage.heroImageMainAlt,
        heroImageSecondaryAlt: projectsPage.heroImageSecondaryAlt,
        logoText: projectsPage.logoText,
        breadcrumbText: projectsPage.breadcrumbText,
        heroTitle: projectsPage.heroTitle
      },
      seoData: {
        metaTitle: projectsPage.metaTitle,
        metaDescription: projectsPage.metaDescription,
        metaKeywords: projectsPage.metaKeywords,
        ogTitle: projectsPage.ogTitle,
        ogDescription: projectsPage.ogDescription,
        ogImage: await this.getStaticAsset(projectsPage.ogImageId),
        structuredData: projectsPage.structuredData
      },
      projects: projects.map((project) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        featuredImage: project.featuredImage,
        tags: project.tags,
        featured: project.featured,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalProjects,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    };
  }

  private async getStaticAsset(assetId: string) {
    if (!assetId) {
      return null;
    }

    try {
      return await this.staticAssetsService.findById(assetId);
    } catch (error) {
      console.warn('Static asset not found:', assetId);
      return null;
    }
  }

  async getProjectsPageDataAdmin() {
    const projectsPage = await this.projectsPageModel.findOne();

    if (!projectsPage) {
      throw new NotFoundException('Projects page content not found');
    }

    // Return data with IDs for admin endpoint
    return {
      id: projectsPage.id,
      title: projectsPage.title,
      subtitle: projectsPage.subtitle,
      description: projectsPage.description,
      footerText: projectsPage.footerText,
      heroImageMainId: projectsPage.heroImageMainId,
      heroImageSecondaryId: projectsPage.heroImageSecondaryId,
      heroImageMainAlt: projectsPage.heroImageMainAlt,
      heroImageSecondaryAlt: projectsPage.heroImageSecondaryAlt,
      logoText: projectsPage.logoText,
      breadcrumbText: projectsPage.breadcrumbText,
      heroTitle: projectsPage.heroTitle,
      metaTitle: projectsPage.metaTitle,
      metaDescription: projectsPage.metaDescription,
      metaKeywords: projectsPage.metaKeywords,
      ogTitle: projectsPage.ogTitle,
      ogDescription: projectsPage.ogDescription,
      ogImageId: projectsPage.ogImageId,
      structuredData: projectsPage.structuredData
    };
  }
}
