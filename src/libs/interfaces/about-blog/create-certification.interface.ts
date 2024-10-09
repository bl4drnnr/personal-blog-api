import { CreateCertificationDto } from '@dto/create-certification.dto';
import { Transaction } from 'sequelize';

export interface CreateCertificationInterface {
  payload: CreateCertificationDto;
  trx?: Transaction;
}
