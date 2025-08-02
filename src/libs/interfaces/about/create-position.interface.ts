import { Transaction } from 'sequelize';
import { CreatePositionDto } from '@dto/create-position.dto';

export interface CreatePositionInterface {
  experienceId: string;
  data: CreatePositionDto;
  trx: Transaction;
}
