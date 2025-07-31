import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChangelogPage } from '@models/changelog-page.model';
import { ChangelogEntry } from '@models/changelog-entry.model';
import { StaticAssetModel } from '@models/static-asset.model';
import { ChangelogController } from './changelog.controller';
import { ChangelogService } from './changelog.service';
import { ApiConfigService } from '@shared/config.service';
import { JwtModule } from '@nestjs/jwt';
import { StaticAssetsModule } from '@modules/static-assets/static-assets.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ChangelogPage, ChangelogEntry, StaticAssetModel]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    }),
    StaticAssetsModule
  ],
  controllers: [ChangelogController],
  providers: [ChangelogService],
  exports: [ChangelogService]
})
export class ChangelogModule {}
