import { Transaction } from 'sequelize';

export interface TogglePublishArticleInterface {
  articleId: string;
  trx?: Transaction;
}
