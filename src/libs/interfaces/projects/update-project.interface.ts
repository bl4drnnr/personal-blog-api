import { CreateProjectDto } from '@dto/create-project.dto';
import { Transaction } from 'sequelize';

export interface UpdateProjectInterface {
  projectId: string;
  data: Partial<CreateProjectDto>;
  trx: Transaction;
}
