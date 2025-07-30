import { Transaction } from 'sequelize';

export interface DeleteCertificateInterface {
  certificateId: string;
  trx: Transaction;
}
