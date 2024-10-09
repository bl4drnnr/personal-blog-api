import { Transaction } from 'sequelize';

export interface ListAuthorsInterface {
  query: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  trx?: Transaction;
}
