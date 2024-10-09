import { Transaction } from 'sequelize';

export interface GetCertificationsByCommonIdInterface {
  certCommonId: string;
  trx?: Transaction;
}
