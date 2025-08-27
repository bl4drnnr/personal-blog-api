import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CopyrightController } from './copyright.controller';
import { CopyrightService } from './copyright.service';
import { Copyright } from '@models/copyright.model';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Copyright]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [CopyrightController],
  providers: [CopyrightService]
})
export class CopyrightModule {}
