import {
  Body,
  Controller,
  Post,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/jwt.guard';
import { UserId } from '@decorators/user.decorator';
import { GenerateRecoveryKeysDto } from '@dto/generate-recovery-keys.dto';
import { LoginGenerateRecoveryKeysDto } from '@dto/login-generate-recovery-keys.dto';
import { RecoverAccountDto } from '@dto/recover-account.dto';

@Controller('recovery')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @UsePipes(ValidationPipe)
  @Post('registration-generate-recovery-keys')
  registrationGenerateRecoveryKeys(
    @Query('confirmationHash') confirmationHash: string,
    @Body() payload: GenerateRecoveryKeysDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.recoveryService.registrationGenerateRecoveryKeys({
      confirmationHash,
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('login-generate-recovery-keys')
  loginGenerateRecoveryKeys(
    @Body() payload: LoginGenerateRecoveryKeysDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.recoveryService.loginGenerateRecoveryKeys({
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('generate-recovery-keys')
  generateRecoveryKeys(
    @Body() payload: GenerateRecoveryKeysDto,
    @UserId() userId: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.recoveryService.generateRecoveryKeys({
      payload,
      userId,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('recover-account')
  recoverUserAccount(
    @Body() payload: RecoverAccountDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.recoveryService.recoverUserAccount({ payload, trx });
  }
}
