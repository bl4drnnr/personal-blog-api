import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { LicensePage } from '@models/license-page.model';
import { LicenseTile } from '@models/license-tile.model';

@Injectable()
export class LicenseService {
  constructor(
    @InjectModel(LicensePage) private licensePageModel: typeof LicensePage,
    @InjectModel(LicenseTile) private licenseTileModel: typeof LicenseTile
  ) {}

  async getLicensePageData() {
    const [licensePage, licenseTiles] = await Promise.all([
      this.licensePageModel.findOne(),
      this.licenseTileModel.findAll({
        order: [
          ['sortOrder', 'ASC'],
          ['createdAt', 'ASC']
        ]
      })
    ]);

    if (!licensePage) {
      throw new NotFoundException('License page content not found');
    }

    return {
      pageContent: {
        title: licensePage.title,
        licenseDate: licensePage.licenseDate,
        paragraphs: licensePage.paragraphs,
        additionalInfo: {
          title: licensePage.additionalInfoTitle,
          paragraphs: licensePage.additionalInfoParagraphs
        }
      },
      layoutData: {
        footerText: licensePage.footerText,
        heroImageMain: licensePage.heroImageMain,
        heroImageSecondary: licensePage.heroImageSecondary,
        heroImageMainAlt: licensePage.heroImageMainAlt,
        heroImageSecondaryAlt: licensePage.heroImageSecondaryAlt,
        logoText: licensePage.logoText,
        breadcrumbText: licensePage.breadcrumbText,
        heroTitle: licensePage.heroTitle
      },
      seoData: {
        metaTitle: licensePage.metaTitle,
        metaDescription: licensePage.metaDescription,
        metaKeywords: licensePage.metaKeywords,
        ogTitle: licensePage.ogTitle,
        ogDescription: licensePage.ogDescription,
        ogImage: licensePage.ogImage,
        structuredData: licensePage.structuredData
      },
      licenseTiles
    };
  }

  async getLicenseTiles() {
    return await this.licenseTileModel.findAll({
      order: [
        ['sortOrder', 'ASC'],
        ['createdAt', 'ASC']
      ]
    });
  }

  async createLicenseTile({
    data,
    trx
  }: {
    data: {
      title: string;
      description: string;
      links: Array<{
        label: string;
        url: string;
      }>;
      sortOrder?: number;
    };
    trx: Transaction;
  }) {
    return await this.licenseTileModel.create(data, { transaction: trx });
  }

  async updateLicenseTile({
    tileId,
    data,
    trx
  }: {
    tileId: string;
    data: {
      title?: string;
      description?: string;
      links?: Array<{
        label: string;
        url: string;
      }>;
      sortOrder?: number;
    };
    trx: Transaction;
  }) {
    const tile = await this.licenseTileModel.findByPk(tileId);

    if (!tile) {
      throw new NotFoundException('License tile not found');
    }

    await tile.update(data, { transaction: trx });
    return tile;
  }

  async deleteLicenseTile({ tileId, trx }: { tileId: string; trx: Transaction }) {
    const tile = await this.licenseTileModel.findByPk(tileId);

    if (!tile) {
      throw new NotFoundException('License tile not found');
    }

    await tile.destroy({ transaction: trx });
    return { message: 'License tile deleted successfully' };
  }

  async updateLicensePage({
    data,
    trx
  }: {
    data: {
      title?: string;
      licenseDate?: string;
      paragraphs?: string[];
      additionalInfoTitle?: string;
      additionalInfoParagraphs?: string[];
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
    let licensePage = await this.licensePageModel.findOne();

    if (!licensePage) {
      licensePage = await this.licensePageModel.create(data, { transaction: trx });
    } else {
      await licensePage.update(data, { transaction: trx });
    }

    return licensePage;
  }
}
