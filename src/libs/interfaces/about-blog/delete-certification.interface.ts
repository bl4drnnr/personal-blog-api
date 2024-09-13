import { Transaction } from 'sequelize';

export interface DeleteCertificationInterface {
  certificationId: string;
  trx?: Transaction;
}
