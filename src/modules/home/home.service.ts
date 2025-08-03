import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { HomePage } from '@models/home-page.model';
import { ProjectModel } from '@models/project.model';
import { ArticleModel } from '@models/article.model';
import { Faq } from '@models/faq.model';
import { WhysSection } from '@models/whys-section.model';
import { StaticAssetsService } from '@modules/static-assets.service';
import { CreateWhysSectionDto } from '@dto/whys-section/requests/create-whys-section.dto';
import { UpdateWhysSectionDto } from '@dto/whys-section/requests/update-whys-section.dto';

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
        heroImageMain: await this.getStaticAsset(homePage.heroImageMainId),
        heroImageSecondary: await this.getStaticAsset(homePage.heroImageSecondaryId),
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
        ogImage: await this.getStaticAsset(homePage.ogImageId),
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

  // Admin methods for whys section management
  async getWhysSections() {
    return await this.whysSectionModel.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async createWhysSection({
    data,
    trx
  }: {
    data: CreateWhysSectionDto;
    trx: Transaction;
  }) {
    return await this.whysSectionModel.create(data, { transaction: trx });
  }

  async updateWhysSection({
    whysSectionId,
    data,
    trx
  }: {
    whysSectionId: string;
    data: UpdateWhysSectionDto;
    trx: Transaction;
  }) {
    const whysSection = await this.whysSectionModel.findByPk(whysSectionId, {
      transaction: trx
    });

    if (!whysSection) {
      throw new NotFoundException('Whys section not found');
    }

    await whysSection.update(data, { transaction: trx });
    return whysSection;
  }

  async deleteWhysSection({
    whysSectionId,
    trx
  }: {
    whysSectionId: string;
    trx: Transaction;
  }) {
    const whysSection = await this.whysSectionModel.findByPk(whysSectionId, {
      transaction: trx
    });

    if (!whysSection) {
      throw new NotFoundException('Whys section not found');
    }

    await whysSection.destroy({ transaction: trx });
    return { message: 'Whys section deleted successfully' };
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
