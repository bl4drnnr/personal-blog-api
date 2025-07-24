import { Module } from '@nestjs/common';
import { NewslettersController } from './newsletters.controller';
import { NewslettersService } from './newsletters.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Newsletter } from '@models/newsletters.model';

@Module({
  controllers: [NewslettersController],
  providers: [NewslettersService],
  imports: [SequelizeModule.forFeature([Newsletter])]
})
export class NewslettersModule {}
