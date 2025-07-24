import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { SiteConfigModel } from '@models/site-config.model';
import { SiteConfigNotFoundException } from '@exceptions/site-config-not-found.exception';
import { UpdateSiteConfigDto } from '@dto/update-site-config.dto';

@Injectable()
export class SiteConfigService {
  constructor(
    @InjectModel(SiteConfigModel)
    private readonly siteConfigModel: typeof SiteConfigModel
  ) {}

  async getConfig() {
    const config = await this.siteConfigModel.findOne();

    if (!config) {
      throw new SiteConfigNotFoundException();
    }

    return config;
  }

  async getPublicConfig() {
    const config = await this.getConfig();

    return {
      siteName: config.siteName,
      siteDescription: config.siteDescription,
      siteAuthor: config.siteAuthor,
      siteUrl: config.siteUrl,
      defaultImage: config.defaultImage,
      keywords: config.keywords,
      socialMedia: config.socialMedia,
      organization: config.organization
    };
  }

  async updateConfig(payload: { data: UpdateSiteConfigDto; trx?: Transaction }) {
    const { data, trx } = payload;

    let config = await this.siteConfigModel.findOne({ transaction: trx });

    if (!config) {
      config = await this.siteConfigModel.create(data, { transaction: trx });
    } else {
      await config.update(data, { transaction: trx });
      await config.reload({ transaction: trx });
    }

    return config;
  }
}
