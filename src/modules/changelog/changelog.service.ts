import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChangelogPage } from '@models/changelog-page.model';
import { ChangelogEntry } from '@models/changelog-entry.model';
import { StaticAssetModel } from '@models/static-asset.model';
import { CreateChangelogEntryInterface } from '@interfaces/create-changelog-entry.interface';
import { UpdateChangelogEntryInterface } from '@interfaces/update-changelog-entry.interface';
import { DeleteChangelogEntryInterface } from '@interfaces/delete-changelog-entry.interface';
import { UpdateChangelogPageInterface } from '@interfaces/update-changelog-page.interface';
import { ChangelogPageContentNotFoundException } from '@exceptions/changelog-page-content-not-found.exception';
import { ChangelogEntryNotFoundException } from '@exceptions/changelog-entry-not-found.exception';

@Injectable()
export class ChangelogService {
  constructor(
    @InjectModel(ChangelogPage) private changelogPageModel: typeof ChangelogPage,
    @InjectModel(ChangelogEntry) private changelogEntryModel: typeof ChangelogEntry
  ) {}

  async getChangelogPageData() {
    const [changelogPage, entries] = await Promise.all([
      this.changelogPageModel.findOne({
        include: [
          {
            model: StaticAssetModel,
            as: 'heroImageMain',
            required: false
          },
          {
            model: StaticAssetModel,
            as: 'heroImageSecondary',
            required: false
          },
          {
            model: StaticAssetModel,
            as: 'ogImage',
            required: false
          }
        ]
      }),
      this.changelogEntryModel.findAll({
        order: [
          ['sortOrder', 'ASC'],
          ['createdAt', 'DESC']
        ]
      })
    ]);

    if (!changelogPage) {
      throw new ChangelogPageContentNotFoundException();
    }

    return {
      layoutData: {
        footerText: changelogPage.footerText,
        heroImageMain: changelogPage.heroImageMain.s3Url,
        heroImageSecondary: changelogPage.heroImageSecondary.s3Url,
        heroImageMainAlt: changelogPage.heroImageMainAlt,
        heroImageSecondaryAlt: changelogPage.heroImageSecondaryAlt,
        logoText: changelogPage.logoText,
        breadcrumbText: changelogPage.breadcrumbText,
        heroTitle: changelogPage.heroTitle
      },
      seoData: {
        metaTitle: changelogPage.metaTitle,
        metaDescription: changelogPage.metaDescription,
        metaKeywords: changelogPage.metaKeywords,
        ogTitle: changelogPage.ogTitle,
        ogDescription: changelogPage.ogDescription,
        ogImage: changelogPage.ogImage.s3Url,
        structuredData: changelogPage.structuredData
      },
      entries
    };
  }

  async getChangelogPageAdmin() {
    const changelogPage = await this.changelogPageModel.findOne({
      include: [
        {
          model: StaticAssetModel,
          as: 'heroImageMain',
          required: false
        },
        {
          model: StaticAssetModel,
          as: 'heroImageSecondary',
          required: false
        },
        {
          model: StaticAssetModel,
          as: 'ogImage',
          required: false
        }
      ]
    });

    if (!changelogPage) {
      throw new ChangelogPageContentNotFoundException();
    }

    return {
      footerText: changelogPage.footerText,
      heroTitle: changelogPage.heroTitle,
      heroImageMainId: changelogPage.heroImageMainId,
      heroImageSecondaryId: changelogPage.heroImageSecondaryId,
      heroImageMainAlt: changelogPage.heroImageMainAlt,
      heroImageSecondaryAlt: changelogPage.heroImageSecondaryAlt,
      logoText: changelogPage.logoText,
      breadcrumbText: changelogPage.breadcrumbText,
      metaTitle: changelogPage.metaTitle,
      metaDescription: changelogPage.metaDescription,
      metaKeywords: changelogPage.metaKeywords,
      ogTitle: changelogPage.ogTitle,
      ogDescription: changelogPage.ogDescription,
      ogImageId: changelogPage.ogImageId,
      structuredData: changelogPage.structuredData
    };
  }

  async getChangelogEntries() {
    return await this.changelogEntryModel.findAll({
      order: [
        ['sortOrder', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });
  }

  async createChangelogEntry({ data, trx }: CreateChangelogEntryInterface) {
    return await this.changelogEntryModel.create(data, { transaction: trx });
  }

  async updateChangelogEntry({ entryId, data, trx }: UpdateChangelogEntryInterface) {
    const entry = await this.changelogEntryModel.findByPk(entryId);

    if (!entry) {
      throw new ChangelogEntryNotFoundException();
    }

    await entry.update(data, { transaction: trx });
    return entry;
  }

  async deleteChangelogEntry({ entryId, trx }: DeleteChangelogEntryInterface) {
    const entry = await this.changelogEntryModel.findByPk(entryId);

    if (!entry) {
      throw new ChangelogEntryNotFoundException();
    }

    await entry.destroy({ transaction: trx });
    return { message: 'Changelog entry deleted successfully' };
  }

  async updateChangelogPage({ data, trx }: UpdateChangelogPageInterface) {
    let changelogPage = await this.changelogPageModel.findOne();

    if (!changelogPage) {
      changelogPage = await this.changelogPageModel.create(data, {
        transaction: trx
      });
    } else {
      await changelogPage.update(data, { transaction: trx });
    }

    return changelogPage;
  }
}
