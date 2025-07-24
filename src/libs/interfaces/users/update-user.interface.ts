import { Transaction } from 'sequelize';

export interface UpdateUserInterface {
  userId: string;
  payload: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    isMfaSet?: boolean;
  };
  trx?: Transaction;
}
