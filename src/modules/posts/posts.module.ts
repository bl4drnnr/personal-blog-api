import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import { AuthModule } from '@auth/auth.module';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [SequelizeModule.forFeature([Post]), AuthModule],
  exports: [PostsService]
})
export class PostsModule {}
