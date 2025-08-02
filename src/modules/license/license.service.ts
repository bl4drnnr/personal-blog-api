import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LicensePage } from '@models/license-page.model';
import { LicenseTile } from '@models/license-tile.model';
import { CreateLicenseTileInterface } from '@interfaces/create-license-tile.interface';
import { UpdateLicenseTileInterface } from '@interfaces/update-license-tile.interface';
import { DeleteLicenseTileInterface } from '@interfaces/delete-license-tile.interface';
import { UpdateLicensePageInterface } from '@interfaces/update-license-page.interface';
import { StaticAssetsService } from '@modules/static-assets.service';

@Injectable()
export class LicenseService {
  constructor(
    @InjectModel(LicensePage) private licensePageModel: typeof LicensePage,
    @InjectModel(LicenseTile) private licenseTileModel: typeof LicenseTile,
    private readonly staticAssetsService: StaticAssetsService
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
        heroImageMain: await this.getStaticAsset(licensePage.heroImageMainId),
        heroImageSecondary: await this.getStaticAsset(
          licensePage.heroImageSecondaryId
        ),
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
        ogImage: await this.getStaticAsset(licensePage.ogImageId),
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

  async createLicenseTile({ data, trx }: CreateLicenseTileInterface) {
    return await this.licenseTileModel.create(data, { transaction: trx });
  }

  async updateLicenseTile({ tileId, data, trx }: UpdateLicenseTileInterface) {
    const tile = await this.licenseTileModel.findByPk(tileId);

    if (!tile) {
      throw new NotFoundException('License tile not found');
    }

    await tile.update(data, { transaction: trx });
    return tile;
  }

  async deleteLicenseTile({ tileId, trx }: DeleteLicenseTileInterface) {
    const tile = await this.licenseTileModel.findByPk(tileId);

    if (!tile) {
      throw new NotFoundException('License tile not found');
    }

    await tile.destroy({ transaction: trx });
    return { message: 'License tile deleted successfully' };
  }

  async getLicensePageDataAdmin() {
    const licensePage = await this.licensePageModel.findOne();

    if (!licensePage) {
      throw new NotFoundException('License page content not found');
    }

    // Return data with IDs for admin endpoint
    return {
      id: licensePage.id,
      title: licensePage.title,
      licenseDate: licensePage.licenseDate,
      paragraphs: licensePage.paragraphs,
      additionalInfoTitle: licensePage.additionalInfoTitle,
      additionalInfoParagraphs: licensePage.additionalInfoParagraphs,
      footerText: licensePage.footerText,
      heroImageMainId: licensePage.heroImageMainId,
      heroImageSecondaryId: licensePage.heroImageSecondaryId,
      heroImageMainAlt: licensePage.heroImageMainAlt,
      heroImageSecondaryAlt: licensePage.heroImageSecondaryAlt,
      logoText: licensePage.logoText,
      breadcrumbText: licensePage.breadcrumbText,
      heroTitle: licensePage.heroTitle,
      metaTitle: licensePage.metaTitle,
      metaDescription: licensePage.metaDescription,
      metaKeywords: licensePage.metaKeywords,
      ogTitle: licensePage.ogTitle,
      ogDescription: licensePage.ogDescription,
      ogImageId: licensePage.ogImageId,
      structuredData: licensePage.structuredData
    };
  }

  async updateLicensePage({ data, trx }: UpdateLicensePageInterface) {
    let licensePage = await this.licensePageModel.findOne();

    if (!licensePage) {
      licensePage = await this.licensePageModel.create(data, { transaction: trx });
    } else {
      await licensePage.update(data, { transaction: trx });
    }

    return licensePage;
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
