import { Transaction } from 'sequelize';

export interface GetCategoryByNameInterface {
  categoryName: string;
  trx?: Transaction;
}
