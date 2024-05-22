import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { ArticleModel } from '@models/article.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateArticleInterface } from '@interfaces/create-article.interface';
import { ArticleCreatedDto } from '@dto/articles/response/article-created.dto';
import { CategoriesService } from '@modules/categories.service';
import { CategoryNotFoundException } from '@exceptions/category-not-found.exception';
import { ApiConfigService } from '@shared/config.service';
import { WrongPictureException } from '@exceptions/wrong-picture.exception';
import { CryptographicService } from '@shared/cryptographic.service';
import { CryptoHashAlgorithm } from '@interfaces/crypto-hash-algorithm.enum';
import { GetArticleBySlugInterface } from '@interfaces/get-article-by-slug.interface';
import { ArticleNotFoundException } from '@exceptions/articles/article-not-found.exception';
import { DeleteArticleInterface } from '@interfaces/delete-article.interface';
import { GetArticleByIdInterface } from '@interfaces/get-article-by-id.interface';
import { ArticleDeletedDto } from '@dto/articles/response/article-deleted.dto';
import { ListArticlesInterface } from '@interfaces/list-articles.interface';
import { ParseException } from '@exceptions/parse.exception';
import { Op } from 'sequelize';
import { ListArticlesDto } from '@dto/articles/response/list-articles.dto';
import { CategoryModel } from '@models/category.model';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(ArticleModel)
    private readonly articleRepository: typeof ArticleModel,
    private readonly categoryService: CategoriesService,
    private readonly configService: ApiConfigService,
    private readonly cryptographicService: CryptographicService
  ) {}

  async getArticleById({ articleId, trx }: GetArticleByIdInterface) {
    const article = await this.articleRepository.findByPk(articleId, {
      transaction: trx
    });

    if (!article) throw new ArticleNotFoundException();

    return article;
  }

  async getArticleBySlug({ slug, trx }: GetArticleBySlugInterface) {
    const article = await this.articleRepository.findOne({
      where: { articleSlug: slug },
      transaction: trx
    });

    if (!article) throw new ArticleNotFoundException();

    return article;
  }

  async createArticle({ userId, payload, trx }: CreateArticleInterface) {
    const {
      articleName,
      articleDescription,
      articleContent,
      categoryId,
      articleTags,
      articlePicture
    } = payload;

    const articleSlug = this.generateArticleSlug(articleName);

    const category = await this.categoryService.getCategoryById({
      categoryId,
      trx
    });

    if (!category) throw new CategoryNotFoundException();

    const articleImage = await this.uploadArticlePicture(articlePicture);

    await this.articleRepository.create(
      {
        articleName,
        articleSlug,
        articleDescription,
        articleTags,
        articleContent,
        articleImage,
        userId,
        categoryId
      },
      { transaction: trx }
    );

    const articleLink = `account/article/${articleSlug}`;

    return new ArticleCreatedDto(articleLink);
  }

  async deleteArticle({ articleId, trx }: DeleteArticleInterface) {
    await this.getArticleById({ articleId, trx });

    await this.articleRepository.destroy({
      where: { id: articleId },
      transaction: trx
    });

    return new ArticleDeletedDto();
  }

  async listArticles({
    query,
    page,
    pageSize,
    order,
    orderBy,
    trx
  }: ListArticlesInterface) {
    const offset = Number(page) * Number(pageSize);
    const limit = Number(pageSize);

    const paginationParseError =
      isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0;

    if (paginationParseError) throw new ParseException();

    const attributes = [
      'id',
      'articleName',
      'articleSlug',
      'articleDescription',
      'articleTags',
      'articleImage'
    ];

    const where = {};

    if (query) {
      where[Op.or] = [
        { articleName: { [Op.iLike]: `%${query}%` } },
        { articleSlug: { [Op.iLike]: `%${query}%` } },
        { articleDescription: { [Op.iLike]: `%${query}%` } }
      ];
    }

    const { rows, count } = await this.articleRepository.findAndCountAll({
      where,
      attributes,
      limit,
      offset,
      include: [{ model: CategoryModel, attributes: ['categoryName'] }],
      order: [[order, orderBy]],
      transaction: trx
    });

    return new ListArticlesDto(rows, count);
  }

  private async uploadArticlePicture(picture: string) {
    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    const base64Data = Buffer.from(
      picture.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    const type = picture.split(';')[0].split('/')[1];

    if (!['png', 'jpg', 'jpeg'].includes(type))
      throw new WrongPictureException();

    const pictureHash = this.cryptographicService.hash({
      data: base64Data.toString() + Date.now().toString(),
      algorithm: CryptoHashAlgorithm.MD5
    });

    const pictureName = `${pictureHash}.${type}`;

    const params = {
      Bucket: bucketName,
      Key: `articles-main-pictures/${pictureName}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };

    await s3.upload(params).promise();

    return pictureName;
  }

  private generateArticleSlug(articleName: string) {
    let slug = articleName.toLowerCase();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^\w\-]+/g, '');

    return slug;
  }
}
