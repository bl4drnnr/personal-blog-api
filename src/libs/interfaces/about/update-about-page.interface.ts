import { UpdateAboutPageDto } from '@dto/update-about-page.dto';
import { Transaction } from 'sequelize';

export interface UpdateAboutPageInterface {
  aboutPageId: string;
  data: UpdateAboutPageDto;
  trx?: Transaction;
}
