import { Transaction } from 'sequelize';

export interface UnsubscribeFromNewslettersInterface {
  newslettersId: string;
  trx?: Transaction;
}
