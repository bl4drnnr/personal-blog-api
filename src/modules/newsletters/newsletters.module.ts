import { Module } from '@nestjs/common';
import { NewslettersController } from './newsletters.controller';
import { NewslettersService } from './newsletters.service';
import { EndUserModule } from '@modules/end-user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Newsletter } from '@models/newsletters.model';

@Module({
  controllers: [NewslettersController],
  providers: [NewslettersService],
  imports: [EndUserModule, SequelizeModule.forFeature([Newsletter])]
})
export class NewslettersModule {}
