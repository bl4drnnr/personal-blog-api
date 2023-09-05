import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { Language } from '@enums/language.enum';
import { Transaction } from 'sequelize';

export interface SecurityInitEmailInterface {
  payload: VerificationEmailInterface;
  language?: Language;
  trx?: Transaction;
}
