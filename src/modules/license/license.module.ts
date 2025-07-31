import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LicensePage } from '@models/license-page.model';
import { LicenseTile } from '@models/license-tile.model';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';
import { ApiConfigService } from '@shared/config.service';
import { JwtModule } from '@nestjs/jwt';
import { StaticAssetsModule } from '@modules/static-assets/static-assets.module';

@Module({
  imports: [
    SequelizeModule.forFeature([LicensePage, LicenseTile]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    }),
    StaticAssetsModule
  ],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService]
})
export class LicenseModule {}
