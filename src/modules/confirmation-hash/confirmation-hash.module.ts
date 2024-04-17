import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { UsersModule } from '@modules/users.module';
import { AuthModule } from '@modules/auth.module';
import { ConfirmationHashController } from '@modules/confirmation-hash.controller';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';

@Module({
  controllers: [ConfirmationHashController],
  providers: [ConfirmationHashService],
  imports: [
    SequelizeModule.forFeature([ConfirmationHash]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule)
  ],
  exports: [ConfirmationHashService]
})
export class ConfirmationHashModule {}
