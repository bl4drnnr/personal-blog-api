import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PageModel } from '@models/page.model';
import { PageNotFoundException } from '@exceptions/page-not-found.exception';
import { CreatePageInterface } from '@interfaces/create-page.interface';
import { UpdatePageInterface } from '@interfaces/update-page.interface';
import { GetPageBySlugInterface } from '@interfaces/get-page-by-slug.interface';
import { DeletePageInterface } from '@interfaces/delete-page.interface';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(PageModel)
    private readonly pageModel: typeof PageModel
  ) {}

  async create(payload: CreatePageInterface) {
    const { data, userId, trx } = payload;

    return await this.pageModel.create(
      {
        ...data,
        userId
      },
      { transaction: trx }
    );
  }

  async findAll() {
    return await this.pageModel.findAll({
      where: { published: true },
      order: [['createdAt', 'DESC']]
    });
  }

  async findAllAdmin() {
    return await this.pageModel.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async getPageBySlug({ slug }: GetPageBySlugInterface) {
    const page = await this.pageModel.findOne({
      where: { slug, published: true }
    });

    if (!page) {
      throw new PageNotFoundException();
    }

    return {
      slug: page.slug,
      title: page.title,
      content: page.content,
      structuredData: page.structuredData,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      metaKeywords: page.metaKeywords,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      ogImage: page.ogImage,
      published: page.published,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt
    };
  }

  async getPageBySlugAdmin({ slug }: GetPageBySlugInterface) {
    const page = await this.pageModel.findOne({
      where: { slug }
    });

    if (!page) {
      throw new PageNotFoundException();
    }

    return page;
  }

  async update(payload: UpdatePageInterface) {
    const { pageId, data, trx } = payload;

    const [updatedRowsCount] = await this.pageModel.update(data, {
      where: { id: pageId },
      transaction: trx
    });

    if (updatedRowsCount === 0) {
      throw new PageNotFoundException();
    }

    return await this.pageModel.findByPk(pageId, { transaction: trx });
  }

  async delete(payload: DeletePageInterface) {
    const { pageId, trx } = payload;

    const deletedRowsCount = await this.pageModel.destroy({
      where: { id: pageId },
      transaction: trx
    });

    if (deletedRowsCount === 0) {
      throw new PageNotFoundException();
    }

    return { message: 'Page deleted successfully' };
  }

  async getSlugs() {
    const pages = await this.pageModel.findAll({
      where: { published: true },
      attributes: ['slug', 'title', 'metaTitle', 'metaDescription', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    return pages.map((page) => ({
      slug: page.slug,
      title: page.title,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      date: page.createdAt
    }));
  }
}
