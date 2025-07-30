import { Transaction } from 'sequelize';

export interface DeleteLicenseTileInterface {
  tileId: string;
  trx?: Transaction;
}
