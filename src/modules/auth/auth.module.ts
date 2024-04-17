import { forwardRef, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from '@models/session.model';
import { UserSettings } from '@models/user-settings.model';
import { UsersModule } from '@modules/users.module';
import { AuthController } from '@modules/auth.controller';
import { AuthService } from '@modules/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Session, UserSettings]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
