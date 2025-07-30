import { UpdateStaticAssetDto } from '@dto/static-assets/requests/update-static-asset.dto';
import { Transaction } from 'sequelize';

export interface UpdateStaticAssetInterface {
  id: string;
  data: UpdateStaticAssetDto;
  trx?: Transaction;
}
