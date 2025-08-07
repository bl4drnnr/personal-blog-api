import { UpdateFaqDto } from '@dto/faq/requests/update-faq.dto';
import { Transaction } from 'sequelize';

export interface UpdateFaqServiceInterface {
  id: string;
  data: UpdateFaqDto;
  trx: Transaction;
}
