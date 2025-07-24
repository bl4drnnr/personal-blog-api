import { CreateProjectDto } from '@dto/projects/requests/create-project.dto';
import { Transaction } from 'sequelize';

export interface UpdateProjectInterface {
  projectId: string;
  data: Partial<CreateProjectDto>;
  trx: Transaction;
}
