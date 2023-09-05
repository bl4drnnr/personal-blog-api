import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { Transaction } from 'sequelize';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TransactionParam } from '@decorators/transaction.decorator';
import { CookieRefreshToken } from '@decorators/cookie-refresh-token.decorator';
import { UserId } from '@decorators/user.decorator';
import { AuthGuard } from '@guards/jwt.guard';
import { LogInUserDto } from '@dto/log-in-user.dto';
import { RegistrationDto } from '@dto/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('login')
  login(@Body() payload: LogInUserDto, @TransactionParam() trx: Transaction) {
    return this.authService.login({ payload, trx });
  }

  // @UsePipes(ValidationPipe)
  // @Post('registration')
  // registration(
  //   @Body() payload: RegistrationDto,
  //   @TransactionParam() trx: Transaction
  // ) {
  //   return this.authService.registration({ payload, trx });
  // }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(
    @UserId() userId: string,
    @Res() res: any,
    @TransactionParam() trx: Transaction
  ) {
    res.clearCookie('_rt');

    const response = await this.authService.logout({ userId, trx });

    return res.status(HttpStatus.OK).json(response);
  }

  @Get('refresh')
  refreshTokens(
    @CookieRefreshToken() refreshToken: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.authService.refreshToken({
      refreshToken,
      trx
    });
  }
}
