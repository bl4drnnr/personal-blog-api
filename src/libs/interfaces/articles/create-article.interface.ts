import { CreateArticleDto } from '@dto/create-article.dto';
import { Transaction } from 'sequelize';

export interface CreateArticleInterface {
  data: CreateArticleDto;
  userId: string;
  trx: Transaction;
}
