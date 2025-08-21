import { CreateNotFoundPageDto } from '@dto/not-found/requests/create-not-found-page.dto';
import { Transaction } from 'sequelize';

export interface CreateNotFoundPageInterface {
  data: CreateNotFoundPageDto;
  trx?: Transaction;
}
