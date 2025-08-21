import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NotFoundPage } from '@models/not-found-page.model';
import { StaticAssetsService } from '@modules/static-assets/static-assets.service';
import { NotFoundPageNotFoundException } from '@exceptions/not-found/not-found-page-not-found.exception';
import { CreateNotFoundPageInterface } from '@interfaces/create-not-found-page.interface';
import { UpdateNotFoundPageInterface } from '@interfaces/update-not-found-page.interface';

@Injectable()
export class NotFoundService {
  constructor(
    @InjectModel(NotFoundPage) private notFoundPageModel: typeof NotFoundPage,
    private readonly staticAssetsService: StaticAssetsService
  ) {}

  async getNotFoundPageData() {
    const notFoundPage = await this.notFoundPageModel.findOne();

    if (!notFoundPage) {
      throw new NotFoundPageNotFoundException();
    }

    // Fetch actual image using asset ID
    let heroImageMain = null;

    try {
      if (notFoundPage.heroImageMainId) {
        const asset = await this.staticAssetsService.findById(
          notFoundPage.heroImageMainId
        );
        heroImageMain = asset.s3Url;
      }
    } catch (error) {
      console.warn('Hero main image not found:', notFoundPage.heroImageMainId);
    }

    return {
      pageContent: {
        title: notFoundPage.title,
        content: notFoundPage.content
      },
      layoutData: {
        heroImageMain,
        heroImageMainAlt: notFoundPage.heroImageMainAlt,
        heroTitle: notFoundPage.heroTitle
      }
    };
  }

  async getNotFoundPageDataAdmin() {
    const notFoundPage = await this.notFoundPageModel.findOne();

    if (!notFoundPage) {
      throw new NotFoundPageNotFoundException();
    }

    return {
      id: notFoundPage.id,
      title: notFoundPage.title,
      content: notFoundPage.content,
      heroImageMainId: notFoundPage.heroImageMainId,
      heroImageMainAlt: notFoundPage.heroImageMainAlt,
      heroTitle: notFoundPage.heroTitle,
      createdAt: notFoundPage.createdAt,
      updatedAt: notFoundPage.updatedAt
    };
  }

  async createNotFoundPage({ data, trx }: CreateNotFoundPageInterface) {
    await this.notFoundPageModel.create(
      {
        title: data.title,
        content: data.content,
        heroImageMainId: data.heroImageMainId,
        heroImageMainAlt: data.heroImageMainAlt,
        heroTitle: data.heroTitle
      },
      { transaction: trx }
    );

    return { message: 'Not found page created successfully' };
  }

  async updateNotFoundPage({ data, trx }: UpdateNotFoundPageInterface) {
    let notFoundPage = await this.notFoundPageModel.findOne();

    if (!notFoundPage) {
      notFoundPage = await this.notFoundPageModel.create(data, { transaction: trx });
    } else {
      await notFoundPage.update(data, { transaction: trx });
    }

    return notFoundPage;
  }
}
