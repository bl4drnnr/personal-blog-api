import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AboutPage } from '@models/about-page.model';
import { Experience } from '@models/experience.model';
import { Position } from '@models/position.model';
import { Certificate } from '@models/certificate.model';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { ApiConfigService } from '@shared/config.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([AboutPage, Experience, Position, Certificate]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [AboutController],
  providers: [AboutService],
  exports: [AboutService]
})
export class AboutModule {}
