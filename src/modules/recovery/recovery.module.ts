import { Module } from '@nestjs/common';
import { RecoveryController } from './recovery.controller';
import { RecoveryService } from './recovery.service';
import { ConfirmationHashModule } from '@confirmation-hash/confirmation-hash.module';
import { UsersModule } from '@users/users.module';
import {JwtModule} from "@nestjs/jwt";

@Module({
  controllers: [RecoveryController],
  providers: [RecoveryService],
  imports: [ConfirmationHashModule, UsersModule, JwtModule]
})
export class RecoveryModule {}
