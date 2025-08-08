import { Transaction } from 'sequelize';
import { UpdateProjectDto } from '@dto/update-project.dto';

export interface UpdateProjectInterface {
  data: UpdateProjectDto;
  trx: Transaction;
}
