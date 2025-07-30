import { CreatePrivacySectionDto } from '@dto/create-privacy-section.dto';
import { Transaction } from 'sequelize';

export interface CreatePrivacySectionInterface {
  data: CreatePrivacySectionDto;
  trx?: Transaction;
}
