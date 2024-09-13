import { Transaction } from 'sequelize';

export interface ListCertifications {
  query: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  trx?: Transaction;
}
