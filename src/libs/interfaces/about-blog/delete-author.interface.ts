import { Transaction } from 'sequelize';

export interface DeleteAuthorInterface {
  authorId: string;
  trx?: Transaction;
}
