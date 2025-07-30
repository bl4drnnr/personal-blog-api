import { UpdatePrivacyPageDto } from '@dto/update-privacy-page.dto';
import { Transaction } from 'sequelize';

export interface UpdatePrivacyPage {
  data: UpdatePrivacyPageDto;
  trx?: Transaction;
}
