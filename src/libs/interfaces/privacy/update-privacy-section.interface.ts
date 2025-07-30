import { UpdatePrivacySectionDto } from '@dto/update-privacy-section.dto';
import { Transaction } from 'sequelize';

export interface UpdatePrivacySection {
  sectionId: string;
  data: UpdatePrivacySectionDto;
  trx: Transaction;
}
