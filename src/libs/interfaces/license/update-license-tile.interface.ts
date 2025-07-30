import { UpdateLicenseTileDto } from '@dto/update-license-tile.dto';
import { Transaction } from 'sequelize';

export interface UpdateLicenseTileInterface {
  tileId: string;
  data: UpdateLicenseTileDto;
  trx?: Transaction;
}
