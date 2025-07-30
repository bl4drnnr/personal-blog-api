import { UpdateChangelogPageDto } from '@dto/update-changelog-page.dto';
import { Transaction } from 'sequelize';

export interface UpdateChangelogPageInterface {
  data: UpdateChangelogPageDto;
  trx?: Transaction;
}
