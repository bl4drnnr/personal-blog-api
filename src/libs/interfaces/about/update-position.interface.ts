import { Transaction } from 'sequelize';
import { UpdatePositionDto } from '@dto/update-position.dto';

export interface UpdatePositionInterface {
  positionId: string;
  data: UpdatePositionDto;
  trx: Transaction;
}
