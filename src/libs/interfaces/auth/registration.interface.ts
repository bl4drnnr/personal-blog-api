import { RegistrationDto } from '@dto/registration.dto';
import { Transaction } from 'sequelize';

export interface RegistrationInterface {
  payload: RegistrationDto;
  trx?: Transaction;
}
