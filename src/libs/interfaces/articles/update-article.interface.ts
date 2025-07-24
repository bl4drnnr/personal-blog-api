import { CreateArticleDto } from '@dto/articles/requests/create-article.dto';
import { Transaction } from 'sequelize';

export interface UpdateArticleInterface {
  articleId: string;
  data: Partial<CreateArticleDto>;
  trx: Transaction;
}
