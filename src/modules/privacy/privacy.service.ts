import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PrivacyPage } from '@models/privacy-page.model';
import { PrivacySection } from '@models/privacy-section.model';
import { UpdatePrivacyPage } from '@interfaces/update-privacy-page.interface';
import { CreatePrivacySectionInterface } from '@interfaces/create-privacy-section.interface';
import { UpdatePrivacySection } from '@interfaces/update-privacy-section.interface';
import { DeletePrivacySectionInterface } from '@interfaces/delete-privacy-section.interface';
import { StaticAssetsService } from '@modules/static-assets.service';

@Injectable()
export class PrivacyService {
  constructor(
    @InjectModel(PrivacyPage) private privacyPageModel: typeof PrivacyPage,
    @InjectModel(PrivacySection) private privacySectionModel: typeof PrivacySection,
    private readonly staticAssetsService: StaticAssetsService
  ) {}

  async getPrivacyPageData() {
    const privacyPage = await this.privacyPageModel.findOne();

    if (!privacyPage) {
      throw new NotFoundException('Privacy page content not found');
    }

    // Fetch sections separately and properly associate them
    const sections = await this.privacySectionModel.findAll({
      where: {
        privacyPageId: privacyPage.id
      },
      order: [
        ['sortOrder', 'ASC'],
        ['createdAt', 'ASC']
      ]
    });

    return {
      pageContent: {
        title: privacyPage.title,
        lastUpdated: privacyPage.lastUpdated,
        sections: sections.map((section) => ({
          id: section.id,
          title: section.title,
          content: section.content || ''
        }))
      },
      layoutData: {
        footerText: privacyPage.footerText,
        heroImageMain: await this.staticAssetsService.getStaticAsset(
          privacyPage.heroImageMainId
        ),
        heroImageSecondary: await this.staticAssetsService.getStaticAsset(
          privacyPage.heroImageSecondaryId
        ),
        heroImageMainAlt: privacyPage.heroImageMainAlt,
        heroImageSecondaryAlt: privacyPage.heroImageSecondaryAlt,
        logoText: privacyPage.logoText,
        breadcrumbText: privacyPage.breadcrumbText,
        heroTitle: privacyPage.heroTitle
      },
      seoData: {
        metaTitle: privacyPage.metaTitle,
        metaDescription: privacyPage.metaDescription,
        metaKeywords: privacyPage.metaKeywords,
        ogTitle: privacyPage.ogTitle,
        ogDescription: privacyPage.ogDescription,
        ogImage: await this.staticAssetsService.getStaticAsset(
          privacyPage.ogImageId
        ),
        structuredData: privacyPage.structuredData
      }
    };
  }

  async getPrivacyPageDataAdmin() {
    const privacyPage = await this.privacyPageModel.findOne();

    if (!privacyPage) {
      throw new NotFoundException('Privacy page content not found');
    }

    // Return data with IDs for admin endpoint
    return {
      id: privacyPage.id,
      title: privacyPage.title,
      lastUpdated: privacyPage.lastUpdated,
      footerText: privacyPage.footerText,
      heroImageMainId: privacyPage.heroImageMainId,
      heroImageSecondaryId: privacyPage.heroImageSecondaryId,
      heroImageMainAlt: privacyPage.heroImageMainAlt,
      heroImageSecondaryAlt: privacyPage.heroImageSecondaryAlt,
      logoText: privacyPage.logoText,
      breadcrumbText: privacyPage.breadcrumbText,
      heroTitle: privacyPage.heroTitle,
      metaTitle: privacyPage.metaTitle,
      metaDescription: privacyPage.metaDescription,
      metaKeywords: privacyPage.metaKeywords,
      ogTitle: privacyPage.ogTitle,
      ogDescription: privacyPage.ogDescription,
      ogImageId: privacyPage.ogImageId,
      structuredData: privacyPage.structuredData
    };
  }

  async getPrivacySections() {
    return await this.privacySectionModel.findAll({
      order: [
        ['sortOrder', 'ASC'],
        ['createdAt', 'ASC']
      ]
    });
  }

  async updatePrivacyPage({ data, trx }: UpdatePrivacyPage) {
    let privacyPage = await this.privacyPageModel.findOne();

    if (!privacyPage) {
      privacyPage = await this.privacyPageModel.create(data, { transaction: trx });
    } else {
      await privacyPage.update(data, { transaction: trx });
    }

    return privacyPage;
  }

  async createPrivacySection({ data, trx }: CreatePrivacySectionInterface) {
    return await this.privacySectionModel.create(data, { transaction: trx });
  }

  async updatePrivacySection({ sectionId, data, trx }: UpdatePrivacySection) {
    const section = await this.privacySectionModel.findByPk(sectionId);

    if (!section) {
      throw new NotFoundException('Privacy section not found');
    }

    await section.update(data, { transaction: trx });
    return section;
  }

  async deletePrivacySection({ sectionId, trx }: DeletePrivacySectionInterface) {
    const section = await this.privacySectionModel.findByPk(sectionId);

    if (!section) {
      throw new NotFoundException('Privacy section not found');
    }

    await section.destroy({ transaction: trx });
    return { message: 'Privacy section deleted successfully' };
  }
}
