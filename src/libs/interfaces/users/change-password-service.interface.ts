import { Transaction } from 'sequelize';

export interface ChangePasswordServiceInterface {
  userId: string;
  payload: {
    currentPassword: string;
    newPassword: string;
  };
  trx: Transaction;
}
