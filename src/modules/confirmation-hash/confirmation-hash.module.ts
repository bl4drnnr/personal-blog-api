import { Module } from '@nestjs/common';
import { ConfirmationHashController } from './confirmation-hash.controller';
import { ConfirmationHashService } from './confirmation-hash.service';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '@users/users.module';

@Module({
  controllers: [ConfirmationHashController],
  providers: [ConfirmationHashService],
  imports: [UsersModule, SequelizeModule.forFeature([ConfirmationHash])],
  exports: [ConfirmationHashService]
})
export class ConfirmationHashModule {}
