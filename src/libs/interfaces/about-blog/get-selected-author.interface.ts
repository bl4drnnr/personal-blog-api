import { Transaction } from 'sequelize';

export interface GetSelectedAuthorInterface {
  authorLanguage: string;
  trx?: Transaction;
}
