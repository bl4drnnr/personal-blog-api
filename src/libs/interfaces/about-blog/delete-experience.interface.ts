import { Transaction } from 'sequelize';

export interface DeleteExperienceInterface {
  experienceCommonId: string;
  trx?: Transaction;
}
