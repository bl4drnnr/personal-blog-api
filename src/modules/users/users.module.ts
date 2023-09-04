import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { Post } from '@models/post.model';
import { Session } from '@models/session.model';
import { AuthService } from '@auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  imports: [SequelizeModule.forFeature([Post, User, Session]), JwtModule]
})
export class UsersModule {}
