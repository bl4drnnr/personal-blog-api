import { CreatePageDto } from '@dto/create-page.dto';
import { Transaction } from 'sequelize';

export interface CreatePageInterface {
  data: CreatePageDto;
  userId: string;
  trx?: Transaction;
}
