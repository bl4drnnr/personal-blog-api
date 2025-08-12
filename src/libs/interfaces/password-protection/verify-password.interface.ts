import { Transaction } from 'sequelize';

export interface VerifyPasswordInterface {
  password: string;
  trx: Transaction;
}
