import { CreateStaticAssetDto } from '@dto/static-assets/requests/create-static-asset.dto';
import { Transaction } from 'sequelize';

export interface CreateStaticAssetInterface {
  data: CreateStaticAssetDto;
  trx?: Transaction;
}
