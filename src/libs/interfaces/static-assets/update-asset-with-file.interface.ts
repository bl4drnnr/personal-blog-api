import { UpdateStaticAssetDto } from '@dto/static-assets/requests/update-static-asset.dto';
import { Transaction } from 'sequelize';

export interface UpdateStaticAssetWithFile {
  id: string;
  base64File: string;
  data: UpdateStaticAssetDto & { base64File?: string };
  trx?: Transaction;
}
