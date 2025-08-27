import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SocialLinkModel } from '@models/social-link.model';
import { SocialLinksController } from './social-links.controller';
import { SocialLinksService } from './social-links.service';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';

@Module({
  imports: [
    SequelizeModule.forFeature([SocialLinkModel]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [SocialLinksController],
  providers: [SocialLinksService],
  exports: [SocialLinksService]
})
export class SocialLinksModule {}
