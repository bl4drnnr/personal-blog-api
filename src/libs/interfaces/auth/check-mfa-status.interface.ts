import { UserSettings } from '@models/user-settings.model';
import { Transaction } from 'sequelize';

export interface CheckMfaStatusInterface {
  mfaCode: string;
  userSettings: UserSettings;
  userId: string;
  trx?: Transaction;
}
