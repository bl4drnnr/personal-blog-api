import { CreateWhysSectionDto } from '@dto/whys-section/requests/create-whys-section.dto';
import { Transaction } from 'sequelize';

export interface CreateWhysSectionServiceInterface {
  data: CreateWhysSectionDto;
  trx: Transaction;
}
