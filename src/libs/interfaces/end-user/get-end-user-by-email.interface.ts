import { Transaction } from 'sequelize';

export interface GetEndUserByEmailInterface {
  email: string;
  trx?: Transaction;
}
