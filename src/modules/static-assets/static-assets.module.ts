import { forwardRef, Module } from '@nestjs/common';
import { StaticAssetsController } from './static-assets.controller';
import { StaticAssetsService } from './static-assets.service';
import { AuthModule } from '@modules/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaticAssetModel } from '@models/static-asset.model';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';
import { S3Service } from '@shared/s3.service';
import { CryptographicService } from '@shared/cryptographic.service';

@Module({
  controllers: [StaticAssetsController],
  providers: [
    StaticAssetsService,
    S3Service,
    CryptographicService,
    ApiConfigService
  ],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([StaticAssetModel]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  exports: [StaticAssetsService]
})
export class StaticAssetsModule {}
