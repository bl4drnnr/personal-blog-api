import { Transaction } from 'sequelize';

export interface GetEndUserNewslettersInterface {
  endUserId: string;
  trx?: Transaction;
}
