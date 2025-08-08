import { UpdateStaticAssetDto } from '@dto/static-assets/requests/update-static-asset.dto';
import { Transaction } from 'sequelize';

export interface UpdateStaticAssetInterface {
  data: UpdateStaticAssetDto;
  trx?: Transaction;
}
