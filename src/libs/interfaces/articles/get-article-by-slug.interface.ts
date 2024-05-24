import { Transaction } from 'sequelize';
import { Language } from '@interfaces/language.enum';

export interface GetArticleBySlugInterface {
  slug: string;
  language: Language;
  trx?: Transaction;
}
