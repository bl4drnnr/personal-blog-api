import { Transaction } from 'sequelize';

export interface DeleteStaticAssetInterface {
  id: string;
  trx?: Transaction;
}
