import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { UserSettings } from '@models/user-settings.model';
import { UsersController } from '@modules/users.controller';
import { UsersService } from '@modules/users.service';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { ConfirmationHashModule } from '@modules/confirmation-hash.module';
import { AuthModule } from '@modules/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, UserSettings, ConfirmationHash]),
    forwardRef(() => ConfirmationHashModule),
    forwardRef(() => AuthModule)
  ],
  exports: [UsersService]
})
export class UsersModule {}
