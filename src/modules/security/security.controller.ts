import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { SecurityService } from '@security/security.service';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { LoginGenerate2faQrDto } from '@dto/login-generate-2fa-qr.dto';
import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('registration-generate-2fa-qr')
  registrationGenerateTwoFaQrCode(
    @Query('confirmationHash') confirmationHash: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.registrationGenerateTwoFaQrCode({
      confirmationHash,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('login-generate-2fa-qr')
  loginGenerateTwoFaQrCode(
    @Body() payload: LoginGenerate2faQrDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.loginGenerateTwoFaQrCode({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @Post('registration-verify-2fa')
  registrationVerifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @Query('confirmationHash') confirmationHash: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.registrationVerifyTwoFaQrCode({
      payload,
      confirmationHash,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('login-verify-2fa')
  loginVerifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.loginVerifyTwoFaQrCode({ payload, trx });
  }
}
