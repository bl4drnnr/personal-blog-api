import { EditCategoryDto } from '@dto/edit-category.dto';
import { Transaction } from 'sequelize';

export interface EditCategoryInterface {
  payload: EditCategoryDto;
  trx?: Transaction;
}
