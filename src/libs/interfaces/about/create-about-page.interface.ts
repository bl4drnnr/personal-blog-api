import { CreateAboutPageDto } from '@dto/create-about-page.dto';
import { Transaction } from 'sequelize';

export interface CreateAboutPageInterface {
  data: CreateAboutPageDto;
  trx?: Transaction;
}
