import { Module } from '@nestjs/common';
import { AssetsAdminController } from './assets-admin.controller';
import { AssetsService } from './assets.service';
import { S3Service } from './s3.service';

@Module({
  controllers: [AssetsAdminController],
  providers: [AssetsService, S3Service],
})
export class AssetsModule {}
