import { Transaction } from 'sequelize';

export interface GetNewslettersByIdInterface {
  newslettersId: string;
  trx?: Transaction;
}
