import { UpdateAuthorDto } from '@dto/update-author.dto';
import { Transaction } from 'sequelize';

export interface UpdateAuthorInterface {
  payload: UpdateAuthorDto;
  trx?: Transaction;
}
