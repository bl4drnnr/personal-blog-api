import { CreatePrivacyContentItemDto } from '@dto/create-privacy-content-item.dto';
import { Transaction } from 'sequelize';

export interface CreatePrivacyContentItemInterface {
  data: CreatePrivacyContentItemDto;
  trx: Transaction;
}
