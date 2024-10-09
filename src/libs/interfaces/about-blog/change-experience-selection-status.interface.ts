import { Transaction } from 'sequelize';
import { ChangeExperienceSelectionStatusDto } from '@dto/change-experience-selection-status.dto';

export interface ChangeExperienceSelectionStatusInterface {
  payload: ChangeExperienceSelectionStatusDto;
  trx?: Transaction;
}
