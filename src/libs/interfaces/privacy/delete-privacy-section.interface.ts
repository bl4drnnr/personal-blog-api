import { Transaction } from 'sequelize';

export interface DeletePrivacySectionInterface {
  sectionId: string;
  trx?: Transaction;
}
