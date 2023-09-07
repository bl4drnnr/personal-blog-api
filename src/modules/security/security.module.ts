import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { UsersModule } from '@users/users.module';
import { ConfirmationHashModule } from '@confirmation-hash/confirmation-hash.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService],
  imports: [UsersModule, ConfirmationHashModule, JwtModule]
})
export class SecurityModule {}
