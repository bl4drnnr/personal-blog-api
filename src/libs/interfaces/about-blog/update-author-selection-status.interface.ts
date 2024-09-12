import { UpdateAuthorSelectionStatusDto } from '@dto/update-author-selection-status.dto';
import { Transaction } from 'sequelize';

export interface UpdateAuthorSelectionStatusInterface {
  payload: UpdateAuthorSelectionStatusDto;
  trx?: Transaction;
}
