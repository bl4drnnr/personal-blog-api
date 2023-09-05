import { RegistrationDto } from '@dto/registration.dto';
import { Transaction } from 'sequelize';
import { User } from '@models/user.model';

export interface CreateUserInterface {
  payload: RegistrationDto | Partial<User>;
  trx?: Transaction;
}
