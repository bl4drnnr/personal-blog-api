import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { Session } from '@models/session.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [SequelizeModule.forFeature([User, Session])]
})
export class AuthModule {}
