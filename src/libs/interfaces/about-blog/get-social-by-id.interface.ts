import { Transaction } from 'sequelize';

export interface GetSocialByIdInterface {
  socialId: string;
  trx?: Transaction;
}
