import { Transaction } from 'sequelize';

export interface DeleteWhysSectionServiceInterface {
  whysSectionId: string;
  trx: Transaction;
}
