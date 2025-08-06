import { Transaction } from 'sequelize';

export interface TogglePublishProjectInterface {
  projectId: string;
  trx?: Transaction;
}
