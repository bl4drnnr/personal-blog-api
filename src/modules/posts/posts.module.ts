import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AuthModule } from '@modules/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostModel } from '@models/post.model';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([PostModel])
  ]
})
export class PostsModule {}
