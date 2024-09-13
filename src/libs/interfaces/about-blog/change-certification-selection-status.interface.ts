import { ChangeCertificationSelectionStatusDto } from '@dto/change-certification-selection-status.dto';
import { Transaction } from 'sequelize';

export interface ChangeCertificationSelectionStatusInterface {
  payload: ChangeCertificationSelectionStatusDto;
  trx?: Transaction;
}
