import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { FastifyReply } from 'fastify';
import { SignInRequest } from '@users/dto/sign-in/request.dto';
import { SignInResponse } from '@users/dto/sign-in/response.dto';
import { SignUpResponse } from '@users/dto/sign-up/response.dto';
import { SignUpRequest } from '@users/dto/sign-up/request.dto';
import { LogoutResponse } from '@users/dto/logout/response.dto';
import { UserDecorator } from '@decorators/user.decorator';
import { JwtGuard } from '@guards/jwt.guard';
import { AccountConfirmationResponse } from '@users/dto/account-confirmation/response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() payload: SignInRequest
  ) {
    const { _at, _rt } = await this.usersService.singIn(payload);

    res.cookie('_rt', _rt);

    return new SignInResponse(_at);
  }

  @Post('sign-up')
  async signUp(@Body() payload: SignUpRequest) {
    await this.usersService.signUp(payload);

    return new SignUpResponse();
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(
    @UserDecorator() userId: string,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    res.clearCookie('_rt');
    await this.usersService.logout({ userId });

    return new LogoutResponse();
  }

  @Get('account-confirmation')
  async accountConfirmation(
    @Query('confirmationHash') confirmationHash: string
  ) {
    await this.usersService.accountConfirmation({ confirmationHash });

    return new AccountConfirmationResponse();
  }
}
