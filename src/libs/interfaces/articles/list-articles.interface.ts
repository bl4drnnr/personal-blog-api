import { Transaction } from 'sequelize';

export interface ListArticlesInterface {
  query: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  trx: Transaction;
}
