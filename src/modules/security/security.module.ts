import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { UsersModule } from '@modules/users.module';
import { AuthModule } from '@modules/auth.module';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService],
  imports: [UsersModule, AuthModule]
})
export class SecurityModule {}
