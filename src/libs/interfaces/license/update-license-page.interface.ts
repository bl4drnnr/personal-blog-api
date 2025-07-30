import { UpdateLicensePageDto } from '@dto/update-license-page.dto';
import { Transaction } from 'sequelize';

export interface UpdateLicensePageInterface {
  data: UpdateLicensePageDto;
  trx?: Transaction;
}
