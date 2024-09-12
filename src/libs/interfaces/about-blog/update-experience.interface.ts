import { UpdateExperienceDto } from '@dto/update-experience.dto';
import { Transaction } from 'sequelize';

export interface UpdateExperienceInterface {
  payload: UpdateExperienceDto;
  trx?: Transaction;
}
