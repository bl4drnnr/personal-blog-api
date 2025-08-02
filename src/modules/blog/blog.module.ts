import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogPage } from '@models/blog-page.model';
import { ArticleModel } from '@models/article.model';
import { StaticAssetsModule } from '@modules/static-assets/static-assets.module';

@Module({
  imports: [
    SequelizeModule.forFeature([BlogPage, ArticleModel]),
    StaticAssetsModule
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService]
})
export class BlogModule {}
