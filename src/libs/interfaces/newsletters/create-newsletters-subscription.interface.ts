import { Language } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';

export interface CreateNewslettersSubscriptionInterface {
  endUserId: string;
  newslettersLanguage: Language;
  trx?: Transaction;
}
