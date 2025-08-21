import { UpdateNotFoundPageDto } from '@dto/not-found/requests/update-not-found-page.dto';
import { Transaction } from 'sequelize';

export interface UpdateNotFoundPageInterface {
  data: UpdateNotFoundPageDto;
  trx?: Transaction;
}
