import { Transaction } from 'sequelize';

export interface GetCertificationById {
  certificationId: string;
  trx?: Transaction;
}
