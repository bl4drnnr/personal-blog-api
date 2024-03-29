import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from '@models/session.model';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';
import { UsersModule } from '@users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Session]),
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
