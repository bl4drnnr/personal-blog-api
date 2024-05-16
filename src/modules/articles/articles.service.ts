import { Injectable } from '@nestjs/common';
import { ArticleModel } from '@models/article.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateArticleInterface } from '@interfaces/create-article.interface';
import { ArticleCreatedDto } from '@dto/articles/response/article-created.dto';
import { CategoriesService } from '@modules/categories.service';
import { CategoryNotFoundException } from '@exceptions/category-not-found.exception';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(ArticleModel)
    private readonly articleRepository: typeof ArticleModel,
    private readonly categoryService: CategoriesService
  ) {}

  // @TODO Picture upload + article edit
  async createArticle({ userId, payload, trx }: CreateArticleInterface) {
    const {
      articleName,
      articleDescription,
      articleContent,
      categoryId,
      articleTags
    } = payload;

    const articleSlug = this.generateArticleSlug(articleName);

    const category = await this.categoryService.getCategoryById({
      categoryId,
      trx
    });

    if (!category) throw new CategoryNotFoundException();

    await this.articleRepository.create(
      {
        articleName,
        articleSlug,
        articleDescription,
        articleTags,
        articleContent,
        articleImage: '',
        userId,
        categoryId
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
