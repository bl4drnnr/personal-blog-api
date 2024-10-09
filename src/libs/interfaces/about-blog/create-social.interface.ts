import { Transaction } from 'sequelize';
import { CreateSocialDto } from '@dto/create-social.dto';

export interface CreateSocialInterface {
  payload: CreateSocialDto;
  trx?: Transaction;
}
