import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChangelogPage } from '@models/changelog-page.model';
import { ChangelogEntry } from '@models/changelog-entry.model';
import { ChangelogController } from './changelog.controller';
import { ChangelogService } from './changelog.service';
import { ApiConfigService } from '@shared/config.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([ChangelogPage, ChangelogEntry]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [ChangelogController],
  providers: [ChangelogService],
  exports: [ChangelogService]
})
export class ChangelogModule {}
