import { CreateArticleDto } from '@dto/create-article.dto';
import { Transaction } from 'sequelize';

export interface UpdateArticleInterface {
  articleId: string;
  data: Partial<CreateArticleDto>;
  trx: Transaction;
}
