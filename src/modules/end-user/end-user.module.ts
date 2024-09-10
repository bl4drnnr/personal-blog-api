import { Module } from '@nestjs/common';
import { EndUserController } from './end-user.controller';
import { EndUserService } from './end-user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EndUser } from '@models/end-user.model';

@Module({
  controllers: [EndUserController],
  providers: [EndUserService],
  imports: [SequelizeModule.forFeature([EndUser])],
  exports: [EndUserService]
})
export class EndUserModule {}
