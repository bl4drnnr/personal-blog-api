import { Transaction } from 'sequelize';

export interface GetCategoryByIdInterface {
  categoryId: string;
  trx?: Transaction;
}
