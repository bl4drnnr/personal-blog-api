import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { UsersService } from '@modules/users.service';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { ValidationPipe } from '@pipes/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('user-info')
  getUserInfo(
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.usersService.getUserInfo({ userId, trx });
  }

  @UsePipes(ValidationPipe)
  @Post('forgot-password')
  forgotPassword(
    @Body() payload: ForgotPasswordDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.usersService.forgotPassword({ payload, trx });
  }
}
