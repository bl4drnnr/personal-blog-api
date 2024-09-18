import { UpdateExperiencePositionDto } from '@dto/update-experience-position.dto';
import { Transaction } from 'sequelize';

export interface UpdateExperiencePositionInterface {
  payload: UpdateExperiencePositionDto;
  trx?: Transaction;
}
