import { CreateExperienceDto } from '@dto/create-experience.dto';
import { Transaction } from 'sequelize';

export interface CreateExperienceInterface {
  payload: CreateExperienceDto;
  trx?: Transaction;
}
