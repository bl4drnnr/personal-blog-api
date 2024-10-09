import { UpdateCertificationDto } from '@dto/update-certification.dto';
import { Transaction } from 'sequelize';

export interface UpdateCertificationInterface {
  payload: UpdateCertificationDto;
  trx?: Transaction;
}
