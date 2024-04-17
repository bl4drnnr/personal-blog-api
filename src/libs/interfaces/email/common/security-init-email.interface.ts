import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { UserInfoInterface } from '@interfaces/user-info.interface';
import { Transaction } from 'sequelize';

export interface SecurityInitEmailInterface {
  payload: VerificationEmailInterface;
  userInfo?: UserInfoInterface;
  trx?: Transaction;
}
