import { Transaction } from 'sequelize';

export interface DeletePrivacyContentItemInterface {
  itemId: string;
  trx: Transaction;
}
