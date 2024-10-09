import { Transaction } from 'sequelize';

export interface GetExperiencesByCommonIdInterface {
  experienceCommonId: string;
  trx?: Transaction;
}
