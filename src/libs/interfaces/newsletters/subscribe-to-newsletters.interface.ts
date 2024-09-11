import { SubscribeToNewslettersDto } from '@dto/subscribe-to-newsletters.dto';
import { Transaction } from 'sequelize';
import { Language } from '@interfaces/language.enum';

export interface SubscribeToNewslettersInterface {
  payload: SubscribeToNewslettersDto;
  language: Language;
  trx: Transaction;
}
