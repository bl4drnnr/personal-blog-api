import { SubscribeToNewslettersDto } from '@dto/subscribe-to-newsletters.dto';
import { Transaction } from 'sequelize';

export interface SubscribeToNewslettersInterface {
  payload: SubscribeToNewslettersDto;
  trx?: Transaction;
}
