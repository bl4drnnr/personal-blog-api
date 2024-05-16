import { forwardRef, Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { AuthModule } from '@modules/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArticleModel } from '@models/article.model';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([ArticleModel])
  ]
})
export class ArticlesModule {}
