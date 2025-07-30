import { UpdateSiteConfigDto } from '@dto/update-site-config.dto';
import { Transaction } from 'sequelize';

export interface UpdateConfigInterface {
  data: UpdateSiteConfigDto;
  trx?: Transaction;
}
