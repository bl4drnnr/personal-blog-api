import { Transaction } from 'sequelize';

export interface DeletePositionInterface {
  positionId: string;
  trx: Transaction;
}
