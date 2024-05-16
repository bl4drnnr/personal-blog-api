import { Transaction } from 'sequelize';

export interface DeleteCategoryInterface {
  categoryId: string;
  trx?: Transaction;
}
