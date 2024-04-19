import { CreatePostDto } from '@dto/create-post.dto';
import { Transaction } from 'sequelize';

export interface CreatePostInterface {
  userId: string;
  payload: CreatePostDto;
  trx?: Transaction;
}
