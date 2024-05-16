import { CreateArticleDto } from '@dto/create-article.dto';
import { Transaction } from 'sequelize';

export interface CreateArticleInterface {
  userId: string;
  payload: CreateArticleDto;
  trx?: Transaction;
}
