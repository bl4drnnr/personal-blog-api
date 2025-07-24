import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SiteConfigController } from './site-config.controller';
import { SiteConfigService } from './site-config.service';
import { SiteConfigModel } from '@models/site-config.model';
import { ApiConfigService } from '@shared/config.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([SiteConfigModel]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [SiteConfigController],
  providers: [SiteConfigService],
  exports: [SiteConfigService]
})
export class SiteConfigModule {}
