import { UpdatePasswordProtectionModeDto } from '@dto/password-protection/requests/update-password-protection-mode.dto';
import { Transaction } from 'sequelize';

export interface UpdatePasswordProtectionInterface {
  data: UpdatePasswordProtectionModeDto;
  userId: string;
  trx: Transaction;
}
