import { Transaction } from 'sequelize';

export interface GetAuthorsByCommonIdInterface {
  authorCommonId: string;
  trx?: Transaction;
}
