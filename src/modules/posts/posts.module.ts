import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import { AuthService } from '@auth/auth.service';
import { User } from '@models/user.model';
import { Session } from '@models/session.model';

@Module({
  providers: [PostsService, AuthService],
  controllers: [PostsController],
  imports: [SequelizeModule.forFeature([Post, User, Session])]
})
export class PostsModule {}
