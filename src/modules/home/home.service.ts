import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HomePage } from '@models/home-page.model';
import { ProjectModel } from '@models/project.model';
import { ArticleModel } from '@models/article.model';
import { Faq } from '@models/faq.model';
import { WhysSection } from '@models/whys-section.model';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(HomePage) private homePageModel: typeof HomePage,
    @InjectModel(ProjectModel) private projectModel: typeof ProjectModel,
    @InjectModel(ArticleModel) private articleModel: typeof ArticleModel,
    @InjectModel(Faq) private faqModel: typeof Faq,
    @InjectModel(WhysSection)
    private whysSectionModel: typeof WhysSection
  ) {}

  async getHomePageData() {
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
        heroImageMain: homePage.heroImageMain,
        heroImageSecondary: homePage.heroImageSecondary,
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
        ogImage: homePage.ogImage,
        structuredData: homePage.structuredData
      },
      projects: projects.map((project) => ({
        title: project.title,
        description: project.description,
        imageUrl: project.featuredImage,
        slug: project.slug
      })),
      posts: posts.map((post) => ({
        title: post.title,
        description: post.description,
        excerpt: post.excerpt,
        imageUrl: post.featuredImage,
        slug: post.slug,
        tags: post.tags
      })),
      faqQuestions: faqQuestions.map((faq) => ({
        question: faq.question,
        answer: faq.answer
      })),
      whysSection: whysSection
        ? {
            title: whysSection.title,
            whyBlocks: whysSection.whyBlocks,
            features: whysSection.features
          }
        : {
            title: '',
            whyBlocks: [],
            features: []
          }
    };
  }
}
