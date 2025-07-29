import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { SecurityService } from '@modules/security.service';
import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { LoginGenerate2faQrDto } from '@dto/login-generate-2fa-qr.dto';
import { BasicAuthGuard } from '@guards/basic-auth.guard';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('generate-2fa-qr')
  generateTwoFaQrCode(@UserId() userId: string, @TrxDecorator() trx: Transaction) {
    return this.securityService.generateTwoFaQrCode({ userId, trx });
  }

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BasicAuthGuard)
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
