import { Transaction } from 'sequelize';

export interface DeletePageInterface {
  pageId: string;
  trx?: Transaction;
}
