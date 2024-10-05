import { Transaction } from 'sequelize';

export interface DeleteAuthorInterface {
  authorCommonId: string;
  trx?: Transaction;
}
