import { ChangeAuthorSelectionStatusDto } from '@dto/change-author-selection-status.dto';
import { Transaction } from 'sequelize';

export interface ChangeAuthorSelectionStatusInterface {
  payload: ChangeAuthorSelectionStatusDto;
  trx?: Transaction;
}
