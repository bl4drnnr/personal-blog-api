import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HomePage } from '@models/home-page.model';
import { ProjectModel } from '@models/project.model';
import { ArticleModel } from '@models/article.model';
import { Faq } from '@models/faq.model';
import { WhysSection } from '@models/whys-section.model';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(HomePage)
    private homePageModel: typeof HomePage,
    @InjectModel(ProjectModel)
    private projectModel: typeof ProjectModel,
    @InjectModel(ArticleModel)
    private articleModel: typeof ArticleModel,
    @InjectModel(Faq)
    private faqModel: typeof Faq,
    @InjectModel(WhysSection)
    private whysSectionModel: typeof WhysSection
  ) {}

  // Home page management methods
  async getHomePageDataAdmin() {
    const [homePage, projects, posts, faqQuestions, whysSection] = await Promise.all(
      [
        this.homePageModel.findOne(),
        this.projectModel.findAll({
          where: { featured: true, published: true },
          order: [['createdAt', 'DESC']],
          limit: 3
        }),
        this.articleModel.findAll({
          where: { featured: true, published: true },
          order: [['createdAt', 'DESC']],
          limit: 3
        }),
        this.faqModel.findAll({
          where: { featured: true, isActive: true },
          order: [
            ['sortOrder', 'ASC'],
            ['createdAt', 'ASC']
          ]
        }),
        this.whysSectionModel.findOne({
          where: { featured: true }
        })
      ]
    );

    if (!homePage) {
      throw new NotFoundException('Home page content not found');
    }

    return {
      pageContent: {
        id: homePage.id,
        title: homePage.title,
        subtitle: homePage.subtitle,
        description: homePage.description,
        marqueeLeftText: homePage.marqueeLeftText,
        marqueeRightText: homePage.marqueeRightText,
        latestProjectsTitle: homePage.latestProjectsTitle,
        latestPostsTitle: homePage.latestPostsTitle,
        whySectionTitle: homePage.whySectionTitle,
        faqSectionTitle: homePage.faqSectionTitle
      },
      layoutData: {
        footerText: homePage.footerText,
        heroImageMainId: homePage.heroImageMainId,
        heroImageSecondaryId: homePage.heroImageSecondaryId,
        heroImageMainAlt: homePage.heroImageMainAlt,
        heroImageSecondaryAlt: homePage.heroImageSecondaryAlt,
        logoText: homePage.logoText,
        breadcrumbText: homePage.breadcrumbText,
        heroTitle: homePage.heroTitle
      },
      seoData: {
        metaTitle: homePage.metaTitle,
        metaDescription: homePage.metaDescription,
        metaKeywords: homePage.metaKeywords,
        ogTitle: homePage.ogTitle,
        ogDescription: homePage.ogDescription,
        ogImageId: homePage.ogImageId,
        structuredData: homePage.structuredData
      },
      projects: projects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        imageUrl: project.featuredImage,
        slug: project.slug,
        featured: project.featured
      })),
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        excerpt: post.excerpt,
        imageUrl: post.featuredImage,
        slug: post.slug,
        tags: post.tags,
        featured: post.featured
      })),
      faqQuestions: faqQuestions.map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        featured: faq.featured,
        isActive: faq.isActive,
        sortOrder: faq.sortOrder
      })),
      whysSection: whysSection
        ? {
            id: whysSection.id,
            title: whysSection.title,
            blocks: whysSection.whyBlocks || [],
            featured: whysSection.featured
          }
        : null
    };
  }

  async updateHomePage({ data, trx }) {
    const homePage = await this.homePageModel.findOne();

    if (!homePage) {
      throw new NotFoundException('Home page content not found');
    }

    await this.homePageModel.update(data, {
      where: { id: homePage.id },
      transaction: trx
    });

    return await this.homePageModel.findByPk(homePage.id, { transaction: trx });
  }
}
