import { UpdatePageDto } from '@dto/update-page.dto';
import { Transaction } from 'sequelize';

export interface UpdatePageInterface {
  pageId: string;
  data: UpdatePageDto;
  trx?: Transaction;
}
