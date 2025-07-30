import { UpdateChangelogEntryDto } from '@dto/update-changelog-entry.dto';
import { Transaction } from 'sequelize';

export interface UpdateChangelogEntryInterface {
  entryId: string;
  data: UpdateChangelogEntryDto;
  trx?: Transaction;
}
