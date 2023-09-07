import { Transaction } from 'sequelize';
import { Confirmation } from '@enums/confirmation-type.enum';

export interface GetByHashInterface {
  confirmationHash: string;
  confirmationType?: Confirmation;
  trx?: Transaction;
}
