import { Transaction } from 'sequelize';

export interface ToggleFeaturedArticleInterface {
  articleId: string;
  trx?: Transaction;
}
