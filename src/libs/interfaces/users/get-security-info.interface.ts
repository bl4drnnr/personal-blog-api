import { Transaction } from 'sequelize';

export interface GetSecurityInfoInterface {
  userId: string;
  trx: Transaction;
}
