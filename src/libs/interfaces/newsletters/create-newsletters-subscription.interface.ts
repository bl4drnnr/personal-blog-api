import { Transaction } from 'sequelize';

export interface CreateNewslettersSubscriptionInterface {
  email: string;
  trx?: Transaction;
}
