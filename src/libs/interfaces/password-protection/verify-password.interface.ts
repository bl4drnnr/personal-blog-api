import { Transaction } from 'sequelize';

export interface VerifyPasswordInterface {
  password: string;
  userId: string;
  trx: Transaction;
}
