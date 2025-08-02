import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ArticleModel } from '@models/article.model';
import { ArticleNotFoundException } from '@exceptions/articles/article-not-found.exception';
import { GetArticleBySlugInterface } from '@interfaces/get-article-by-slug.interface';
import { CreateArticleInterface } from '@interfaces/create-article.interface';
import { GetPostsSlugsInterface } from '@interfaces/get-posts-slugs.interface';
import { GetArticlesByUserInterface } from '@interfaces/get-articles-by-user.interface';
import { UpdateArticleInterface } from '@interfaces/update-article.interface';
import { DeleteArticleInterface } from '@interfaces/delete-article.interface';
import { TogglePublishArticleInterface } from '@interfaces/toggle-publish-article.interface';
import { GetAdminPostsInterface } from '@interfaces/get-admin-posts.interface';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(ArticleModel)
    private readonly articleModel: typeof ArticleModel
  ) {}

  async create(payload: CreateArticleInterface) {
    const { data, userId, trx } = payload;

    return await this.articleModel.create(
      {
        ...data,
        userId
      },
      { transaction: trx }
    );
  }

  async findAllPublished() {
    return await this.articleModel.findAll({
      where: { published: true },
      order: [['createdAt', 'DESC']]
    });
  }

  async getPublishedPostBySlug({ slug }: GetArticleBySlugInterface) {
    const post = await this.articleModel.findOne({
      where: { slug }
    });

    if (!post || !post.published) {
      throw new ArticleNotFoundException();
    }

    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: post.content,
      publishDate: post.createdAt,
      updatedDate: post.updatedAt,
      tags: post.tags || [],
      featuredImage: post.featuredImage,
      excerpt: post.excerpt
    };
  }

  async getSlugs(): Promise<GetPostsSlugsInterface[]> {
    const posts = await this.articleModel.findAll({
      where: { published: true },
      attributes: ['slug', 'title', 'description', 'createdAt', 'tags'],
      order: [['createdAt', 'DESC']]
    });

    return posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      publishDate: post.createdAt,
      tags: post.tags || []
    }));
  }

  async findByUserId({ userId, published }: GetArticlesByUserInterface) {
    const whereClause: any = { userId };
    if (published !== undefined) {
      whereClause.published = published;
    }

    return await this.articleModel.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
  }

  async update(payload: UpdateArticleInterface) {
    const { articleId, data, trx } = payload;

    const [updatedRowsCount] = await this.articleModel.update(data, {
      where: { id: articleId },
      transaction: trx
    });

    if (updatedRowsCount === 0) {
      throw new ArticleNotFoundException();
    }

    return await this.articleModel.findByPk(articleId, { transaction: trx });
  }

  async delete(payload: DeleteArticleInterface) {
    const { articleId, trx } = payload;

    const deletedRowsCount = await this.articleModel.destroy({
      where: { id: articleId },
      transaction: trx
    });

    if (deletedRowsCount === 0) {
      throw new ArticleNotFoundException();
    }

    return { message: 'Article deleted successfully' };
  }

  async togglePublished(payload: TogglePublishArticleInterface) {
    const { articleId, trx } = payload;

    const article = await this.articleModel.findByPk(articleId, {
      transaction: trx
    });

    if (!article) {
      throw new ArticleNotFoundException();
    }

    await article.update({ published: !article.published }, { transaction: trx });
    await article.reload({ transaction: trx });

    return article;
  }

  async getAdminPosts({ userId, published }: GetAdminPostsInterface) {
    const isPublished = published !== undefined ? published === 'true' : undefined;
    return this.findByUserId({ userId, published: isPublished });
  }
}
