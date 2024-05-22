import { EditArticleDto } from '@dto/edit-article.dto';
import { Transaction } from 'sequelize';

export interface EditArticleInterface {
  payload: EditArticleDto;
  trx?: Transaction;
}
