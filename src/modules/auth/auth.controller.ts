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
import { AuthService } from '@modules/auth.service';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { UserId } from '@decorators/user-id.decorator';
import { CookieRefreshToken } from '@decorators/cookie-refresh-token.decorator';
import { LogInUserDto } from '@dto/log-in-user.dto';
import { CreateUserDto } from '@dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('login')
  login(@Body() payload: LogInUserDto, @TrxDecorator() trx: Transaction) {
    return this.authService.login({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @Post('registration')
  registration(
    @Body() payload: CreateUserDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.authService.registration({ payload, trx });
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(
    @UserId() userId: string,
    @Res() res: any,
    @TrxDecorator() trx: Transaction
  ) {
    res.clearCookie('_rt');

    const response = await this.authService.logout({ userId, trx });

    return res.status(HttpStatus.OK).json(response);
  }

  @Get('refresh')
  refreshToken(
    @CookieRefreshToken() refreshToken: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.authService.refreshToken({
      refreshToken,
      trx
    });
  }
}
