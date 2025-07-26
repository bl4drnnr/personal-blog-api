import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogPage } from '@models/blog-page.model';
import { ArticleModel } from '@models/article.model';

@Module({
  imports: [SequelizeModule.forFeature([BlogPage, ArticleModel])],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService]
})
export class BlogModule {}
