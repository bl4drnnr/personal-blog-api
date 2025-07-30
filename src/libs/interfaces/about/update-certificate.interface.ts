import { UpdateCertificateDto } from '@dto/update-certificate.dto';
import { Transaction } from 'sequelize';

export interface UpdateCertificateInterface {
  certificateId: string;
  data: UpdateCertificateDto;
  trx?: Transaction;
}
