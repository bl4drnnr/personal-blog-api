import { Injectable } from '@nestjs/common';
import { ArticleModel } from '@models/article.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateArticleInterface } from '@interfaces/create-article.interface';
import { ArticleCreatedDto } from '@dto/articles/response/article-created.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(ArticleModel)
    private readonly postRepository: typeof ArticleModel
  ) {}

  async createPost({ userId, payload, trx }: CreateArticleInterface) {
    const { articleName, articleDescription, articleTags } = payload;

    const articleSlug = this.generateArticleSlug(articleName);

    await this.postRepository.create(
      {
        articleName,
        articleSlug,
        articleDescription,
        articleTags,
        userId,
        categoryId: ''
      },
      { transaction: trx }
    );

    return new ArticleCreatedDto();
  }

  private generateArticleSlug(articleName: string) {
    let slug = articleName.toLowerCase();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^\w\-]+/g, '');

    return slug;
  }
}
