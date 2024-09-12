import { CreateAuthorDto } from '@dto/create-author.dto';
import { Transaction } from 'sequelize';

export interface CreateAuthorInterface {
  userId: string;
  payload: CreateAuthorDto;
  trx?: Transaction;
}
