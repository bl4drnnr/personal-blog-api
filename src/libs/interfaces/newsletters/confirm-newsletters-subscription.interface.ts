import { Transaction } from 'sequelize';

export interface ConfirmNewslettersSubscriptionInterface {
  newslettersId: string;
  trx?: Transaction;
}
