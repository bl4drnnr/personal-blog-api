import { CreateChangelogEntryDto } from '@dto/create-changelog-entry.dto';
import { Transaction } from 'sequelize';

export interface CreateChangelogEntryInterface {
  data: CreateChangelogEntryDto;
  trx?: Transaction;
}
