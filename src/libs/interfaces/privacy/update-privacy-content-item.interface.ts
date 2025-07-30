import { UpdatePrivacyContentItemDto } from '@dto/update-privacy-content-item.dto';
import { Transaction } from 'sequelize';

export interface UpdatePrivacyContentItemInterface {
  itemId: string;
  data: UpdatePrivacyContentItemDto;
  trx: Transaction;
}
