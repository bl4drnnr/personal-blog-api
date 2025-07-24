import { Transaction } from 'sequelize';

export interface DeleteProjectInterface {
  projectId: string;
  trx: Transaction;
}
