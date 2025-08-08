import { Transaction } from 'sequelize';
import { UpdateArticleDto } from '@dto/update-article.dto';

export interface UpdateArticleInterface {
  data: UpdateArticleDto;
  trx: Transaction;
}
