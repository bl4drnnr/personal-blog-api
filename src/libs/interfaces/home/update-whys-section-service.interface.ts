import { UpdateWhysSectionDto } from '@dto/whys-section/requests/update-whys-section.dto';
import { Transaction } from 'sequelize';

export interface UpdateWhysSectionServiceInterface {
  whysSectionId: string;
  data: UpdateWhysSectionDto;
  trx: Transaction;
}
