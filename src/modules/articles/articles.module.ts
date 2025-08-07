import { forwardRef, Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { AuthModule } from '@modules/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArticleModel } from '@models/article.model';
import { BlogPage } from '@models/blog-page.model';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';
import { StaticAssetsModule } from '@modules/static-assets.module';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([ArticleModel, BlogPage]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    }),
    StaticAssetsModule
  ]
})
export class ArticlesModule {}
