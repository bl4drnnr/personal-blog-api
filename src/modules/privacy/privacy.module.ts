import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PrivacyPage } from '@models/privacy-page.model';
import { PrivacySection } from '@models/privacy-section.model';
import { PrivacyContentItem } from '@models/privacy-content-item.model';
import { PrivacyController } from './privacy.controller';
import { PrivacyService } from './privacy.service';
import { ApiConfigService } from '@shared/config.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([PrivacyPage, PrivacySection, PrivacyContentItem]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [PrivacyController],
  providers: [PrivacyService],
  exports: [PrivacyService]
})
export class PrivacyModule {}
