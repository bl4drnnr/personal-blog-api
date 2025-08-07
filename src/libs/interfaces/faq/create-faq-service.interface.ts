import { CreateFaqDto } from '@dto/faq/requests/create-faq.dto';
import { Transaction } from 'sequelize';

export interface CreateFaqServiceInterface {
  data: CreateFaqDto;
  trx: Transaction;
}
