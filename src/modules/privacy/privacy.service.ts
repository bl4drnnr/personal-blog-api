import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { PrivacyPage } from '@models/privacy-page.model';
import { PrivacySection } from '@models/privacy-section.model';
import { PrivacyContentItem } from '@models/privacy-content-item.model';

@Injectable()
export class PrivacyService {
  constructor(
    @InjectModel(PrivacyPage) private privacyPageModel: typeof PrivacyPage,
    @InjectModel(PrivacySection) private privacySectionModel: typeof PrivacySection,
    @InjectModel(PrivacyContentItem)
    private privacyContentItemModel: typeof PrivacyContentItem
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
        heroImageMain: privacyPage.heroImageMain,
        heroImageSecondary: privacyPage.heroImageSecondary,
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
        ogImage: privacyPage.ogImage,
        structuredData: privacyPage.structuredData
      }
    };
  }

  async updatePrivacyPage({
    data,
    trx
  }: {
    data: {
      title?: string;
      lastUpdated?: string;
      cookiePolicyTitle?: string;
      footerText?: string;
      heroImageMain?: string;
      heroImageSecondary?: string;
      heroImageMainAlt?: string;
      heroImageSecondaryAlt?: string;
      logoText?: string;
      breadcrumbText?: string;
      heroTitle?: string;
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
      structuredData?: object;
    };
    trx: Transaction;
  }) {
    let privacyPage = await this.privacyPageModel.findOne();

    if (!privacyPage) {
      privacyPage = await this.privacyPageModel.create(data, { transaction: trx });
    } else {
      await privacyPage.update(data, { transaction: trx });
    }

    return privacyPage;
  }

  async createPrivacySection({
    data,
    trx
  }: {
    data: {
      title: string;
      sortOrder?: number;
      sectionType?: 'main' | 'cookie_policy';
    };
    trx: Transaction;
  }) {
    return await this.privacySectionModel.create(data, { transaction: trx });
  }

  async updatePrivacySection({
    sectionId,
    data,
    trx
  }: {
    sectionId: string;
    data: {
      title?: string;
      sortOrder?: number;
      sectionType?: 'main' | 'cookie_policy';
    };
    trx: Transaction;
  }) {
    const section = await this.privacySectionModel.findByPk(sectionId);

    if (!section) {
      throw new NotFoundException('Privacy section not found');
    }

    await section.update(data, { transaction: trx });
    return section;
  }

  async deletePrivacySection({
    sectionId,
    trx
  }: {
    sectionId: string;
    trx: Transaction;
  }) {
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

  async createPrivacyContentItem({
    data,
    trx
  }: {
    data: {
      privacySectionId: string;
      type: string;
      text?: string;
      items?: string[];
      linkText?: string;
      linkUrl?: string;
      sortOrder?: number;
    };
    trx: Transaction;
  }) {
    return await this.privacyContentItemModel.create(data, { transaction: trx });
  }

  async updatePrivacyContentItem({
    itemId,
    data,
    trx
  }: {
    itemId: string;
    data: {
      type?: string;
      text?: string;
      items?: string[];
      linkText?: string;
      linkUrl?: string;
      sortOrder?: number;
    };
    trx: Transaction;
  }) {
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
  }: {
    itemId: string;
    trx: Transaction;
  }) {
    const item = await this.privacyContentItemModel.findByPk(itemId);

    if (!item) {
      throw new NotFoundException('Privacy content item not found');
    }

    await item.destroy({ transaction: trx });
    return { message: 'Privacy content item deleted successfully' };
  }
}
