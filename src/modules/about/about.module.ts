import { Module } from '@nestjs/common';
import { AboutAdminController } from './about-admin.controller';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';

@Module({
  controllers: [AboutController, AboutAdminController],
  providers: [AboutService],
})
export class AboutModule {}
