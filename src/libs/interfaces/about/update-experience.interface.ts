import { UpdateExperienceDto } from '@dto/update-experience.dto';
import { Transaction } from 'sequelize';

export interface UpdateExperienceInterface {
  experienceId: string;
  data: UpdateExperienceDto;
  trx?: Transaction;
}
