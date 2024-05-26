import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { UserInfoInterface } from '@interfaces/user-info.interface';
import { Transaction } from 'sequelize';
import { Language } from '@interfaces/language.enum';

export interface SecurityInitEmailInterface {
  payload: VerificationEmailInterface;
  userInfo?: UserInfoInterface;
  trx?: Transaction;
  language?: Language;
}
