import { Transaction } from 'sequelize';

export interface CreateEndUserInterface {
  email: string;
  trx?: Transaction;
}
