import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { HomePage } from '@models/home-page.model';
import { ProjectModel } from '@models/project.model';
import { ArticleModel } from '@models/article.model';
import { Faq } from '@models/faq.model';
import { WhysSection } from '@models/whys-section.model';
import { StaticAssetsModule } from '@modules/static-assets/static-assets.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      HomePage,
      ProjectModel,
      ArticleModel,
      Faq,
      WhysSection
    ]),
    StaticAssetsModule
  ],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService]
})
export class HomeModule {}
