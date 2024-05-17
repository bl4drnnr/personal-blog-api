import { Transaction } from 'sequelize';

export interface GetArticleBySlugInterface {
  slug: string;
  trx?: Transaction;
}
