import { CreateLicenseTileDto } from '@dto/create-license-tile.dto';
import { Transaction } from 'sequelize';

export interface CreateLicenseTileInterface {
  data: CreateLicenseTileDto;
  trx?: Transaction;
}
