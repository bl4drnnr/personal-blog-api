import { Transaction } from 'sequelize';

export interface ConfirmNewslettersSubscriptionByIdInterface {
  newslettersId: string;
  trx?: Transaction;
}
