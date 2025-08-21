import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotFoundController } from './not-found.controller';
import { NotFoundService } from './not-found.service';
import { NotFoundPage } from '@models/not-found-page.model';
import { StaticAssetsModule } from '@modules/static-assets/static-assets.module';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';

@Module({
  imports: [
    SequelizeModule.forFeature([NotFoundPage]),
    StaticAssetsModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [NotFoundController],
  providers: [NotFoundService],
  exports: [NotFoundService]
})
export class NotFoundModule {}
