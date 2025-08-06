import { Module } from '@nestjs/common';
import { NewslettersController } from './newsletters.controller';
import { NewslettersService } from './newsletters.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Newsletter } from '@models/newsletters.model';
import { SubscribePage } from '@models/subscribe-page.model';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';

@Module({
  controllers: [NewslettersController],
  providers: [NewslettersService],
  imports: [
    SequelizeModule.forFeature([Newsletter, SubscribePage]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ]
})
export class NewslettersModule {}
