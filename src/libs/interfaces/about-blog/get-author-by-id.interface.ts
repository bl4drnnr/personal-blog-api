import { Transaction } from 'sequelize';

export interface GetAuthorByIdInterface {
  authorId: string;
  trx?: Transaction;
}
