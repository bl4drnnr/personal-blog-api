import { Transaction } from 'sequelize';

export interface DeleteSocialInterface {
  socialId: string;
  trx?: Transaction;
}
