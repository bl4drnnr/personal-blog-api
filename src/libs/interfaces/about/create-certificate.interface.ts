import { CreateCertificateDto } from '@dto/create-certificate.dto';
import { Transaction } from 'sequelize';

export interface CreateCertificateInterface {
  data: CreateCertificateDto;
  trx?: Transaction;
}
