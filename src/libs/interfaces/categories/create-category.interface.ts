import { CreateCategoryDto } from '@dto/create-category.dto';
import { Transaction } from 'sequelize';

export interface CreateCategoryInterface {
  payload: CreateCategoryDto;
  trx?: Transaction;
}
