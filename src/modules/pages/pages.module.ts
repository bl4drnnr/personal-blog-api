import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PageModel } from '@models/page.model';
import { HomePage } from '@models/home-page.model';
import { BlogPage } from '@models/blog-page.model';
import { ProjectsPage } from '@models/projects-page.model';
import { ProjectModel } from '@models/project.model';
import { ArticleModel } from '@models/article.model';
import { Faq } from '@models/faq.model';
import { WhysSection } from '@models/whys-section.model';
import { StaticAssetModel } from '@models/static-asset.model';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { ApiConfigService } from '@shared/config.service';
import { JwtModule } from '@nestjs/jwt';
import { StaticAssetsService } from '@modules/static-assets/static-assets.service';
import { S3Service } from '@shared/s3.service';
import { CryptographicService } from '@shared/cryptographic.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PageModel,
      HomePage,
      BlogPage,
      ProjectsPage,
      ProjectModel,
      ArticleModel,
      Faq,
      WhysSection,
      StaticAssetModel
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [PagesController],
  providers: [
    PagesService,
    StaticAssetsService,
    S3Service,
    CryptographicService,
    ApiConfigService
  ],
  exports: [PagesService]
})
export class PagesModule {}
