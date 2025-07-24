import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PageModel } from '@models/page.model';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { ApiConfigService } from '@shared/config.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([PageModel]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService]
})
export class PagesModule {}
