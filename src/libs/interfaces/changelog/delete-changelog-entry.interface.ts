import { Transaction } from 'sequelize';

export interface DeleteChangelogEntryInterface {
  entryId: string;
  trx?: Transaction;
}
