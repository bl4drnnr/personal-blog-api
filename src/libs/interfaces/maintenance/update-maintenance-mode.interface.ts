import { Transaction } from 'sequelize';
import { UpdateMaintenanceModeDto } from '@dto/maintenance/requests/update-maintenance-mode.dto';

export interface UpdateMaintenanceModeInterface {
  data: UpdateMaintenanceModeDto;
  trx: Transaction;
}
