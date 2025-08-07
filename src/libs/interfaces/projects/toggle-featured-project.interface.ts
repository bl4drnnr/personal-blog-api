import { Transaction } from 'sequelize';

export interface ToggleFeaturedProjectInterface {
  projectId: string;
  trx?: Transaction;
}
