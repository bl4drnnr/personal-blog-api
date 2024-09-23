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
import {
  LogInUserDto,
  LogInUserResponseDto
} from '@dto/log-in-user.dto';
import { CreateUserDto } from '@dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @Body() payload: LogInUserDto,
    @Res({ passthrough: true }) res: any,
    @TrxDecorator() trx: Transaction
  ) {
    const response = await this.authService.login({ payload, trx });

    if (response instanceof LogInUserResponseDto) {
      res.cookie('_rt', response._rt, { httpOnly: true });
      return { _at: response._at };
    } else {
      return response;
    }
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
  async refreshToken(
    @CookieRefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: any,
    @TrxDecorator() trx: Transaction
  ) {
    const response = await this.authService.refreshToken({
      refreshToken,
      trx
    });
    res.cookie('_rt', response._rt, { httpOnly: true });
    return { _at: response._at };
  }
}
