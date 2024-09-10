import { Transaction } from 'sequelize';

export interface DeleteNewslettersSubscriptionInterface {
  newslettersId: string;
  trx?: Transaction;
}
