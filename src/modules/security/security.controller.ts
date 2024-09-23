import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { SecurityService } from '@modules/security.service';
import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { LoginGenerate2faQrDto } from '@dto/login-generate-2fa-qr.dto';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('registration-generate-2fa-qr')
  registrationGenerateTwoFaQrCode(
    @Query('confirmationHash') confirmationHash: string,
    @TrxDecorator() trx: Transaction
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
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.loginGenerateTwoFaQrCode({
      payload,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @Get('generate-2fa-qr')
  generateTwoFaQrCode(
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.generateTwoFaQrCode({ userId, trx });
  }

  @UsePipes(ValidationPipe)
  @Post('registration-verify-2fa')
  registrationVerifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @Query('confirmationHash') confirmationHash: string,
    @TrxDecorator() trx: Transaction
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
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.loginVerifyTwoFaQrCode({
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('verify-2fa')
  verifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.verifyTwoFaQrCode({
      payload,
      userId,
      trx
    });
  }
}
