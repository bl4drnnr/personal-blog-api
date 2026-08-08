import { Module } from '@nestjs/common';
import { PostsAdminController } from './posts-admin.controller';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController, PostsAdminController],
  providers: [PostsService],
})
export class PostsModule {}
