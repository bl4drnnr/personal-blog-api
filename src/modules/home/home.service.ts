import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HomePage } from '@models/home-page.model';
import { ProjectModel } from '@models/project.model';
import { ArticleModel } from '@models/article.model';
import { Faq } from '@models/faq.model';
import { WhysSection } from '@models/whys-section.model';
import { StaticAssetsService } from '@modules/static-assets.service';
import { CreateWhysSectionServiceInterface } from '../../libs/interfaces/home/create-whys-section-service.interface';
import { UpdateWhysSectionServiceInterface } from '../../libs/interfaces/home/update-whys-section-service.interface';
import { DeleteWhysSectionServiceInterface } from '../../libs/interfaces/home/delete-whys-section-service.interface';
import { HomeContentNotFoundException } from '@exceptions/home-content-not-found.exception';
import { WhysSectionNotFoundException } from '@exceptions/whys-section-not-found.exception';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(HomePage) private homePageModel: typeof HomePage,
    @InjectModel(ProjectModel) private projectModel: typeof ProjectModel,
    @InjectModel(ArticleModel) private articleModel: typeof ArticleModel,
    @InjectModel(Faq) private faqModel: typeof Faq,
    @InjectModel(WhysSection)
    private whysSectionModel: typeof WhysSection,
    private readonly staticAssetsService: StaticAssetsService
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
      throw new HomeContentNotFoundException();
    }

    const [
      processedProjects,
      processedPosts,
      heroImageMain,
      heroImageSecondary,
      ogImage
    ] = await Promise.all([
      Promise.all(
        projects.map(async (project) => ({
          title: project.title,
          description: project.description,
          featuredImage: await this.staticAssetsService.getStaticAsset(
            project.featuredImageId
          ),
          slug: project.slug
        }))
      ),
      Promise.all(
        posts.map(async (post) => ({
          title: post.title,
          description: post.description,
          excerpt: post.excerpt,
          featuredImage: await this.staticAssetsService.getStaticAsset(
            post.featuredImageId
          ),
          slug: post.slug,
          tags: post.tags
        }))
      ),
      this.staticAssetsService.getStaticAsset(homePage.heroImageMainId),
      this.staticAssetsService.getStaticAsset(homePage.heroImageSecondaryId),
      this.staticAssetsService.getStaticAsset(homePage.ogImageId)
    ]);

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
        heroImageMain,
        heroImageSecondary,
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
        ogImage,
        structuredData: homePage.structuredData
      },
      projects: processedProjects,
      posts: processedPosts,
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

  // Admin methods for whys section management
  async getWhysSections() {
    return await this.whysSectionModel.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async createWhysSection({ data, trx }: CreateWhysSectionServiceInterface) {
    return await this.whysSectionModel.create(data, { transaction: trx });
  }

  async updateWhysSection({
    whysSectionId,
    data,
    trx
  }: UpdateWhysSectionServiceInterface) {
    const whysSection = await this.whysSectionModel.findByPk(whysSectionId, {
      transaction: trx
    });

    if (!whysSection) {
      throw new WhysSectionNotFoundException();
    }

    await whysSection.update(data, { transaction: trx });
    return whysSection;
  }

  async deleteWhysSection({
    whysSectionId,
    trx
  }: DeleteWhysSectionServiceInterface) {
    const whysSection = await this.whysSectionModel.findByPk(whysSectionId, {
      transaction: trx
    });

    if (!whysSection) {
      throw new WhysSectionNotFoundException();
    }

    await whysSection.destroy({ transaction: trx });
    return { message: 'Whys section deleted successfully' };
  }
}
