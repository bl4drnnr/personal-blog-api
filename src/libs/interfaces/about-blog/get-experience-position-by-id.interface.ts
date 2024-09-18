import { Transaction } from 'sequelize';

export interface GetExperiencePositionByIdInterface {
  experiencePositionId: string;
  trx?: Transaction;
}
