import { Transaction } from 'sequelize';

export interface GetExperienceByIdInterface {
  experienceId: string;
  trx?: Transaction;
}
