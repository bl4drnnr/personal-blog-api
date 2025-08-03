import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { Faq } from '@models/faq.model';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Faq]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService]
})
export class FaqModule {}
