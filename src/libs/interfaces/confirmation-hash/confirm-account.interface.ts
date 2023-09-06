import { Transaction } from 'sequelize';

export interface ConfirmAccountInterface {
  confirmationHash: string;
  trx?: Transaction;
}
