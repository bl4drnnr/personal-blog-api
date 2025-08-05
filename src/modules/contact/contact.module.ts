import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactPage } from '@models/contact-page.model';
import { ContactTile } from '@models/contact-tile.model';
import { StaticAssetsModule } from '@modules/static-assets/static-assets.module';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ContactPage, ContactTile]),
    StaticAssetsModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [ContactController],
  providers: [ContactService]
})
export class ContactModule {}
