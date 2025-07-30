import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BlogPage } from '@models/blog-page.model';
import { ArticleModel } from '@models/article.model';
import { GetBlogPageDataInterface } from '@interfaces/get-blog-page-data.interface';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPage) private blogPageModel: typeof BlogPage,
    @InjectModel(ArticleModel) private articleModel: typeof ArticleModel
  ) {}

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
          'featuredImage',
          'tags',
          'createdAt',
          'updatedAt'
        ]
      })
    ]);

    if (!blogPage) {
      throw new NotFoundException('Blog page content not found');
    }

    const totalPages = Math.ceil(totalArticles / limit);
    const hasNextPage = parsedPage < totalPages;
    const hasPrevPage = parsedPage > 1;

    return {
      pageContent: {
        title: blogPage.title,
        subtitle: blogPage.subtitle,
        description: blogPage.description
      },
      layoutData: {
        footerText: blogPage.footerText,
        heroImageMain: blogPage.heroImageMain,
        heroImageSecondary: blogPage.heroImageSecondary,
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
        ogImage: blogPage.ogImage,
        structuredData: blogPage.structuredData
      },
      articles: articles.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.description,
        excerpt: article.excerpt,
        featuredImage: article.featuredImage,
        tags: article.tags,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      })),
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

  async getAllTags() {
    const articles = await this.articleModel.findAll({
      where: { published: true },
      attributes: ['tags'],
      raw: true
    });

    const allTags = articles
      .filter((article) => article.tags && article.tags.length > 0)
      .flatMap((article) => article.tags);

    return [...new Set(allTags)].sort();
  }
}
