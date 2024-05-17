import { Transaction } from 'sequelize';

export interface GetArticleByIdInterface {
  articleId: string;
  trx?: Transaction;
}
