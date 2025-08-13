import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { PasswordProtectionController } from './password-protection.controller';
import { PasswordProtectionService } from './password-protection.service';
import { PasswordProtectionMode } from '@models/password-protection-mode.model';
import { Session } from '@models/session.model';
import { CryptographicService } from '@shared/cryptographic.service';
import { ApiConfigService } from '@shared/config.service';
import { StaticAssetsModule } from '@modules/static-assets.module';

@Module({
  imports: [
    SequelizeModule.forFeature([PasswordProtectionMode, Session]),
    StaticAssetsModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [PasswordProtectionController],
  providers: [PasswordProtectionService, CryptographicService, ApiConfigService],
  exports: [PasswordProtectionService]
})
export class PasswordProtectionModule {}
