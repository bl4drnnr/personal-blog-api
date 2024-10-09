import { UpdateSocialDto } from '@dto/update-social.dto';
import { Transaction } from 'sequelize';

export interface UpdateSocialInterface {
  payload: UpdateSocialDto;
  trx?: Transaction;
}
