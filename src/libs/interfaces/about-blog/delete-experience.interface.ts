import { Transaction } from 'sequelize';

export interface DeleteExperienceInterface {
  experienceId: string;
  trx?: Transaction;
}
