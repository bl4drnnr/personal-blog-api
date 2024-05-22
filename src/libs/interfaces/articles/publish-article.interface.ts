import { Transaction } from 'sequelize';

export interface PublishArticleInterface {
  articleId: string;
  trx?: Transaction;
}
