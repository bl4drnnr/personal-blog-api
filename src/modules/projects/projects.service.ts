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
import { GetAdminProjectsInterface } from '@interfaces/get-admin-projects.interface';
import { TogglePublishProjectInterface } from '@interfaces/toggle-publish-project.interface';
import { ToggleFeaturedProjectInterface } from '@interfaces/toggle-featured-project.interface';
import { StaticAssetsService } from '@modules/static-assets.service';

interface PaginationQuery {
  page?: string;
  limit?: string;
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
      featuredImage: await this.getStaticAsset(project.featuredImageId),
      featured: project.featured,
      published: project.published
    };
  }

  async getProjectBySlugForAdmin({ slug }: GetProjectBySlugInterface) {
    const project = await this.projectModel.findOne({
      where: { slug }
    });

    if (!project) {
      throw new ProjectNotFoundException();
    }

    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      content: project.content,
      featuredImageId: project.featuredImageId,
      tags: project.tags || [],
      published: project.published,
      featured: project.featured,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      userId: project.userId
    };
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
    const { data, trx } = payload;
    const projectId = data.projectId;

    const [updatedRowsCount] = await this.projectModel.update(
      {
        title: data.projectTitle,
        description: data.projectDescription,
        content: data.projectContent,
        featuredImageId: data.projectFeaturedImageId,
        tags: data.projectTags
      },
      {
        where: { id: projectId },
        transaction: trx
      }
    );

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

  async getProjectsPageData(query: PaginationQuery) {
    const { page, limit, search } = query;
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const offset = (parsedPage - 1) * parsedLimit;

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
          limit: parsedLimit,
          offset,
          attributes: [
            'id',
            'title',
            'slug',
            'description',
            'featuredImageId',
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

    const totalPages = Math.ceil(totalProjects / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const hasPrevPage = parsedPage > 1;

    const [processedProjects, heroImageMain, heroImageSecondary, ogImage] =
      await Promise.all([
        Promise.all(
          projects.map(async (project) => ({
            id: project.id,
            title: project.title,
            slug: project.slug,
            description: project.description,
            featuredImage: await this.getStaticAsset(project.featuredImageId),
            tags: project.tags,
            featured: project.featured,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
          }))
        ),
        this.getStaticAsset(projectsPage.heroImageMainId),
        this.getStaticAsset(projectsPage.heroImageSecondaryId),
        this.getStaticAsset(projectsPage.ogImageId)
      ]);

    return {
      pageContent: {
        title: projectsPage.title,
        subtitle: projectsPage.subtitle,
        description: projectsPage.description
      },
      layoutData: {
        footerText: projectsPage.footerText,
        heroImageMain,
        heroImageSecondary,
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
        ogImage,
        structuredData: projectsPage.structuredData
      },
      projects: processedProjects,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalItems: totalProjects,
        itemsPerPage: parsedLimit,
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
      const asset = await this.staticAssetsService.findById(assetId);
      return asset.s3Url;
    } catch (error) {
      console.warn('Static asset not found:', assetId);
      return null;
    }
  }

  async togglePublished(payload: TogglePublishProjectInterface) {
    const { projectId, trx } = payload;

    const project = await this.projectModel.findByPk(projectId, {
      transaction: trx
    });

    if (!project) {
      throw new ProjectNotFoundException();
    }

    await project.update({ published: !project.published }, { transaction: trx });
    await project.reload({ transaction: trx });

    return project;
  }

  async toggleFeatured(payload: ToggleFeaturedProjectInterface) {
    const { projectId, trx } = payload;

    const project = await this.projectModel.findByPk(projectId, {
      transaction: trx
    });

    if (!project) {
      throw new ProjectNotFoundException();
    }

    await project.update({ featured: !project.featured }, { transaction: trx });
    await project.reload({ transaction: trx });

    return project;
  }

  async getAdminProjects({
    userId,
    published,
    query,
    page = 1,
    pageSize = 10,
    order = 'DESC',
    orderBy = 'createdAt'
  }: GetAdminProjectsInterface) {
    const isPublished =
      published !== undefined && published !== '' ? published === 'true' : undefined;

    const whereClause: any = { userId };

    if (isPublished !== undefined) {
      whereClause.published = isPublished;
    }

    // Add search functionality
    if (query) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { content: { [Op.iLike]: `%${query}%` } },
        { slug: { [Op.iLike]: `%${query}%` } }
      ];
    }

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;

    // Validate orderBy field
    const allowedOrderFields = [
      'createdAt',
      'updatedAt',
      'title',
      'published',
      'featured'
    ];
    const validOrderBy = allowedOrderFields.includes(orderBy)
      ? orderBy
      : 'createdAt';

    const { count, rows: projects } = await this.projectModel.findAndCountAll({
      where: whereClause,
      order: [[validOrderBy, order]],
      limit: pageSize,
      offset: offset
    });

    return {
      count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      pageSize,
      rows: projects.map((project) => ({
        id: project.id,
        projectName: project.title,
        projectSlug: project.slug,
        projectDescription: project.description,
        projectImage: project.featuredImageId,
        projectTags: project.tags,
        projectPosted: project.published,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        content: project.content,
        featured: project.featured
      }))
    };
  }
}
