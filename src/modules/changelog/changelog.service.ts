import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { ChangelogPage } from '@models/changelog-page.model';
import { ChangelogEntry } from '@models/changelog-entry.model';

@Injectable()
export class ChangelogService {
  constructor(
    @InjectModel(ChangelogPage) private changelogPageModel: typeof ChangelogPage,
    @InjectModel(ChangelogEntry) private changelogEntryModel: typeof ChangelogEntry
  ) {}

  async getChangelogPageData() {
    const [changelogPage, entries] = await Promise.all([
      this.changelogPageModel.findOne(),
      this.changelogEntryModel.findAll({
        order: [
          ['sortOrder', 'ASC'],
          ['createdAt', 'DESC']
        ]
      })
    ]);

    if (!changelogPage) {
      throw new NotFoundException('Changelog page content not found');
    }

    return {
      pageContent: {
        title: changelogPage.title,
        content: changelogPage.content
      },
      layoutData: {
        footerText: changelogPage.footerText,
        heroImageMain: changelogPage.heroImageMain,
        heroImageSecondary: changelogPage.heroImageSecondary,
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
        ogImage: changelogPage.ogImage,
        structuredData: changelogPage.structuredData
      },
      entries
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

  async createChangelogEntry({
    data,
    trx
  }: {
    data: {
      version: string;
      date: string;
      title: string;
      description: string;
      changes: string[];
      sortOrder?: number;
    };
    trx: Transaction;
  }) {
    return await this.changelogEntryModel.create(data, { transaction: trx });
  }

  async updateChangelogEntry({
    entryId,
    data,
    trx
  }: {
    entryId: string;
    data: {
      version?: string;
      date?: string;
      title?: string;
      description?: string;
      changes?: string[];
      sortOrder?: number;
    };
    trx: Transaction;
  }) {
    const entry = await this.changelogEntryModel.findByPk(entryId);

    if (!entry) {
      throw new NotFoundException('Changelog entry not found');
    }

    await entry.update(data, { transaction: trx });
    return entry;
  }

  async deleteChangelogEntry({
    entryId,
    trx
  }: {
    entryId: string;
    trx: Transaction;
  }) {
    const entry = await this.changelogEntryModel.findByPk(entryId);

    if (!entry) {
      throw new NotFoundException('Changelog entry not found');
    }

    await entry.destroy({ transaction: trx });
    return { message: 'Changelog entry deleted successfully' };
  }

  async updateChangelogPage({
    data,
    trx
  }: {
    data: {
      title?: string;
      content?: string;
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
