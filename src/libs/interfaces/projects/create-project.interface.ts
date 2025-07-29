import { CreateProjectDto } from '@dto/create-project.dto';
import { Transaction } from 'sequelize';

export interface CreateProjectInterface {
  data: CreateProjectDto;
  userId: string;
  trx: Transaction;
}
