import { Transaction } from 'sequelize';

export interface GenerateTokensInterface {
  userId: string;
  trx?: Transaction;
}
