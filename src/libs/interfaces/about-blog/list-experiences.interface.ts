import { Transaction } from 'sequelize';

export interface ListExperiencesInterface {
  query: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  trx?: Transaction;
}
