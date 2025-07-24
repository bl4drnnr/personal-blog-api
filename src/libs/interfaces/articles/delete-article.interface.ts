import { Transaction } from 'sequelize';

export interface DeleteArticleInterface {
  articleId: string;
  trx: Transaction;
}
