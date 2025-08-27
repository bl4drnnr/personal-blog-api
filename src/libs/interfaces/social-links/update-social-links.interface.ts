import { UpdateSocialLinksDto } from '@dto/update-social-links.dto';
import { Transaction } from 'sequelize';

export interface UpdateSocialLinksInterface {
  data: UpdateSocialLinksDto;
  trx?: Transaction;
}
