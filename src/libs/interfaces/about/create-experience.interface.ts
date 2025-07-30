import { CreateExperienceDto } from '@dto/create-experience.dto';
import { Transaction } from 'sequelize';

export interface CreateExperienceInterface {
  data: CreateExperienceDto;
  trx?: Transaction;
}
