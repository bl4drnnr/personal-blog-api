import { Transaction } from 'sequelize';

export interface DeleteCertificationInterface {
  certCommonId: string;
  trx?: Transaction;
}
