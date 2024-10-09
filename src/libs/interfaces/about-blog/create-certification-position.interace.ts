import { CreateExperiencePositionDto } from '@dto/create-experience-position.dto';
import { Transaction } from 'sequelize';

export interface CreateCertificationPosition {
  payload: CreateExperiencePositionDto;
  trx?: Transaction;
}
