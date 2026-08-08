import { Module } from '@nestjs/common';
import { SiteConfigController } from './config.controller';

@Module({
  controllers: [SiteConfigController],
})
export class SiteConfigModule {}
