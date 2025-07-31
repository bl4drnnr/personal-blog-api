import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PrivacyPage } from '@models/privacy-page.model';
import { PrivacySection } from '@models/privacy-section.model';
import { PrivacyContentItem } from '@models/privacy-content-item.model';
import { UpdatePrivacyPage } from '@interfaces/update-privacy-page.interface';
import { CreatePrivacySectionInterface } from '@interfaces/create-privacy-section.interface';
import { UpdatePrivacySection } from '@interfaces/update-privacy-section.interface';
import { DeletePrivacySectionInterface } from '@interfaces/delete-privacy-section.interface';
import { CreatePrivacyContentItemInterface } from '@interfaces/create-privacy-content-item.interface';
import { UpdatePrivacyContentItemInterface } from '@interfaces/update-privacy-content-item.interface';
import { DeletePrivacyContentItemInterface } from '@interfaces/delete-privacy-content-item.interface';
import { StaticAssetsService } from '../static-assets/static-assets.service';

@Injectable()
export class PrivacyService {
  constructor(
    @InjectModel(PrivacyPage) private privacyPageModel: typeof PrivacyPage,
    @InjectModel(PrivacySection) private privacySectionModel: typeof PrivacySection,
    @InjectModel(PrivacyContentItem)
    private privacyContentItemModel: typeof PrivacyContentItem,
    private readonly staticAssetsService: StaticAssetsService
  ) {}

  async getPrivacyPageData() {
    const privacyPage = await this.privacyPageModel.findOne({
      include: [
        {
          model: PrivacySection,
          as: 'sections',
          include: [
            {
              model: PrivacyContentItem,
              as: 'content',
              separate: true,
              order: [['sortOrder', 'ASC']]
            }
          ],
          separate: true,
          order: [['sortOrder', 'ASC']]
        }
      ]
    });

    if (!privacyPage) {
      throw new NotFoundException('Privacy page content not found');
    }

    // Separate main sections from cookie policy sections
    const mainSections = privacyPage.sections.filter(
      (section) => section.sectionType === 'main'
    );
    const cookiePolicySections = privacyPage.sections.filter(
      (section) => section.sectionType === 'cookie_policy'
    );

    return {
      pageContent: {
        title: privacyPage.title,
        lastUpdated: privacyPage.lastUpdated,
        sections: mainSections.map((section) => ({
          title: section.title,
          content: section.content || []
        })),
        cookiePolicy: {
          title: privacyPage.cookiePolicyTitle,
          content:
            cookiePolicySections.length > 0
              ? cookiePolicySections[0].content || []
              : []
        }
      },
      layoutData: {
        footerText: privacyPage.footerText,
        heroImageMain: await this.getStaticAsset(privacyPage.heroImageMainId),
        heroImageSecondary: await this.getStaticAsset(privacyPage.heroImageSecondaryId),
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
        ogImage: await this.getStaticAsset(privacyPage.ogImageId),
        structuredData: privacyPage.structuredData
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
      cookiePolicyTitle: privacyPage.cookiePolicyTitle,
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

    await this.privacyContentItemModel.destroy({
      where: { privacySectionId: sectionId },
      transaction: trx
    });

    await section.destroy({ transaction: trx });
    return { message: 'Privacy section deleted successfully' };
  }

  async createPrivacyContentItem({ data, trx }: CreatePrivacyContentItemInterface) {
    return await this.privacyContentItemModel.create(data, { transaction: trx });
  }

  async updatePrivacyContentItem({
    itemId,
    data,
    trx
  }: UpdatePrivacyContentItemInterface) {
    const item = await this.privacyContentItemModel.findByPk(itemId);

    if (!item) {
      throw new NotFoundException('Privacy content item not found');
    }

    await item.update(data, { transaction: trx });
    return item;
  }

  async deletePrivacyContentItem({
    itemId,
    trx
  }: DeletePrivacyContentItemInterface) {
    const item = await this.privacyContentItemModel.findByPk(itemId);

    if (!item) {
      throw new NotFoundException('Privacy content item not found');
    }

    await item.destroy({ transaction: trx });
    return { message: 'Privacy content item deleted successfully' };
  }
}
