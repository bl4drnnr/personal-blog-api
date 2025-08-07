import { Transaction } from 'sequelize';

export interface UpdateUserProfileServiceInterface {
  userId: string;
  payload: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  trx: Transaction;
}
