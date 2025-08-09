import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ArticleModel } from '@models/article.model';
import { BlogPage } from '@models/blog-page.model';
import { ArticleNotFoundException } from '@exceptions/articles/article-not-found.exception';
import { GetArticleBySlugInterface } from '@interfaces/get-article-by-slug.interface';
import { CreateArticleInterface } from '@interfaces/create-article.interface';
import { GetPostsSlugsInterface } from '@interfaces/get-posts-slugs.interface';
import { UpdateArticleInterface } from '@interfaces/update-article.interface';
import { DeleteArticleInterface } from '@interfaces/delete-article.interface';
import { TogglePublishArticleInterface } from '@interfaces/toggle-publish-article.interface';
import { ToggleFeaturedArticleInterface } from '@interfaces/toggle-featured-article.interface';
import { GetAdminPostsInterface } from '@interfaces/get-admin-posts.interface';
import { StaticAssetsService } from '@modules/static-assets/static-assets.service';
import { GetBlogPageDataInterface } from '@interfaces/get-blog-page-data.interface';
import { SlugService } from '@shared/slug.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(ArticleModel)
    private readonly articleModel: typeof ArticleModel,
    @InjectModel(BlogPage)
    private readonly blogPageModel: typeof BlogPage,
    private readonly staticAssetsService: StaticAssetsService,
    private readonly slugService: SlugService
  ) {}

  async create(payload: CreateArticleInterface) {
    const { data, userId, trx } = payload;
    const {
      articleName,
      articleDescription,
      articleContent,
      articleExcerpt,
      articlePictureId,
      articleTags,
      articlePublished
    } = data;

    // Generate slug from article title
    const baseSlug = this.slugService.generateSlug(articleName);

    // Check for existing slugs to ensure uniqueness
    const existingArticles = await this.articleModel.findAll({
      attributes: ['slug'],
      where: {
        slug: {
          [Op.like]: `${baseSlug}%`
        }
      },
      transaction: trx
    });

    const existingSlugs = existingArticles.map((article) => article.slug);
    const uniqueSlug = this.slugService.generateUniqueSlug(baseSlug, existingSlugs);

    return await this.articleModel.create(
      {
        title: articleName,
        slug: uniqueSlug,
        description: articleDescription,
        content: articleContent,
        excerpt: articleExcerpt,
        published: articlePublished,
        tags: articleTags,
        featuredImageId: articlePictureId,
        userId
      },
      { transaction: trx }
    );
  }

  async findAllPublished() {
    return await this.articleModel.findAll({
      where: { published: true },
      order: [['createdAt', 'DESC']]
    });
  }

  async getPublishedPostBySlug({ slug }: GetArticleBySlugInterface) {
    const post = await this.articleModel.findOne({
      where: { slug }
    });

    if (!post || !post.published) {
      throw new ArticleNotFoundException();
    }

    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: post.content,
      publishDate: post.createdAt,
      updatedDate: post.updatedAt,
      tags: post.tags || [],
      featuredImage: await this.getStaticAsset(post.featuredImageId),
      excerpt: post.excerpt
    };
  }

  async getSlugs(): Promise<GetPostsSlugsInterface[]> {
    const posts = await this.articleModel.findAll({
      where: { published: true },
      attributes: ['slug', 'title', 'description', 'createdAt', 'tags'],
      order: [['createdAt', 'DESC']]
    });

    return posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      publishDate: post.createdAt,
      tags: post.tags || []
    }));
  }

  async update(payload: UpdateArticleInterface) {
    const { data, trx } = payload;
    const articleId = data.articleId;

    const [updatedRowsCount] = await this.articleModel.update(
      {
        title: data.articleName,
        description: data.articleDescription,
        content: data.articleContent,
        tags: data.articleTags,
        featuredImageId: data.articlePictureId
      },
      {
        where: { id: articleId },
        transaction: trx
      }
    );

    if (updatedRowsCount === 0) {
      throw new ArticleNotFoundException();
    }

    return await this.articleModel.findByPk(articleId, { transaction: trx });
  }

  async delete(payload: DeleteArticleInterface) {
    const { articleId, trx } = payload;

    const deletedRowsCount = await this.articleModel.destroy({
      where: { id: articleId },
      transaction: trx
    });

    if (deletedRowsCount === 0) {
      throw new ArticleNotFoundException();
    }

    return { message: 'Article deleted successfully' };
  }

  async togglePublished(payload: TogglePublishArticleInterface) {
    const { articleId, trx } = payload;

    const article = await this.articleModel.findByPk(articleId, {
      transaction: trx
    });

    if (!article) {
      throw new ArticleNotFoundException();
    }

    await article.update({ published: !article.published }, { transaction: trx });
    await article.reload({ transaction: trx });

    return article;
  }

  async toggleFeatured(payload: ToggleFeaturedArticleInterface) {
    const { articleId, trx } = payload;

    const article = await this.articleModel.findByPk(articleId, {
      transaction: trx
    });

    if (!article) {
      throw new ArticleNotFoundException();
    }

    await article.update({ featured: !article.featured }, { transaction: trx });
    await article.reload({ transaction: trx });

    return article;
  }

  async getAdminPosts({
    userId,
    page,
    pageSize,
    order,
    published,
    query,
    orderBy
  }: GetAdminPostsInterface) {
    // Parse string parameters to numbers
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 10;
    const validOrderBy = orderBy || 'createdAt';

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
    const offset = (pageNum - 1) * pageSizeNum;

    // Validate orderBy field
    const allowedOrderFields = [
      'createdAt',
      'updatedAt',
      'title',
      'published',
      'featured'
    ];
    const finalOrderBy = allowedOrderFields.includes(validOrderBy)
      ? validOrderBy
      : 'createdAt';

    const { count, rows: articles } = await this.articleModel.findAndCountAll({
      where: whereClause,
      order: [[finalOrderBy, order || 'DESC']],
      limit: pageSizeNum,
      offset: offset
    });

    return {
      count,
      totalPages: Math.ceil(count / pageSizeNum),
      currentPage: pageNum,
      pageSize: pageSizeNum,
      rows: articles.map((article) => ({
        id: article.id,
        articleName: article.title,
        articleSlug: article.slug,
        articleDescription: article.description,
        articleImage: article.featuredImageId,
        articleTags: article.tags,
        articlePosted: article.published,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        content: article.content,
        excerpt: article.excerpt,
        featured: article.featured
      }))
    };
  }

  async getPostBySlugForAdmin({ slug }: GetArticleBySlugInterface) {
    const post = await this.articleModel.findOne({
      where: { slug }
    });

    if (!post) {
      throw new ArticleNotFoundException();
    }

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: post.content,
      excerpt: post.excerpt,
      featuredImageId: post.featuredImageId,
      tags: post.tags || [],
      published: post.published,
      featured: post.featured,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userId: post.userId
    };
  }

  async getBlogPageData(query: GetBlogPageDataInterface) {
    const { page, limit, search, tag } = query;
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
        { description: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (tag) {
      whereConditions.tags = {
        [Op.contains]: [tag]
      };
    }

    const [blogPage, { rows: articles, count: totalArticles }] = await Promise.all([
      this.blogPageModel.findOne(),
      this.articleModel.findAndCountAll({
        where: whereConditions,
        order: [['createdAt', 'DESC']],
        limit: parsedLimit,
        offset,
        attributes: [
          'id',
          'title',
          'slug',
          'description',
          'excerpt',
          'featuredImageId',
          'tags',
          'createdAt',
          'updatedAt'
        ]
      })
    ]);

    if (!blogPage) {
      throw new NotFoundException('Blog page content not found');
    }

    const totalPages = Math.ceil(totalArticles / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const hasPrevPage = parsedPage > 1;

    const [processedArticles, heroImageMain, heroImageSecondary, ogImage] =
      await Promise.all([
        Promise.all(
          articles.map(async (article) => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            description: article.description,
            excerpt: article.excerpt,
            featuredImage: await this.getStaticAsset(article.featuredImageId),
            tags: article.tags,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt
          }))
        ),
        this.getStaticAsset(blogPage.heroImageMainId),
        this.getStaticAsset(blogPage.heroImageSecondaryId),
        this.getStaticAsset(blogPage.ogImageId)
      ]);

    return {
      pageContent: {
        title: blogPage.title,
        subtitle: blogPage.subtitle,
        description: blogPage.description
      },
      layoutData: {
        footerText: blogPage.footerText,
        heroImageMain,
        heroImageSecondary,
        heroImageMainAlt: blogPage.heroImageMainAlt,
        heroImageSecondaryAlt: blogPage.heroImageSecondaryAlt,
        logoText: blogPage.logoText,
        breadcrumbText: blogPage.breadcrumbText,
        heroTitle: blogPage.heroTitle
      },
      seoData: {
        metaTitle: blogPage.metaTitle,
        metaDescription: blogPage.metaDescription,
        metaKeywords: blogPage.metaKeywords,
        ogTitle: blogPage.ogTitle,
        ogDescription: blogPage.ogDescription,
        ogImage,
        structuredData: blogPage.structuredData
      },
      articles: processedArticles,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalItems: totalArticles,
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
}
