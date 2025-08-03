import {
  Body,
  Controller,
  Get,
  Post,
  Put,
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
import { BasicAuthGuard } from '@guards/basic-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('user-info')
  getUserInfo(@UserId() userId: string, @TrxDecorator() trx: Transaction) {
    return this.usersService.getUserInfo({ userId, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('security-info')
  getSecurityInfo(@UserId() userId: string, @TrxDecorator() trx: Transaction) {
    return this.usersService.getSecurityInfo({ userId, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('profile')
  updateUserProfile(
    @UserId() userId: string,
    @Body() payload: { firstName?: string; lastName?: string; email?: string },
    @TrxDecorator() trx: Transaction
  ) {
    return this.usersService.updateUserProfile({ userId, payload, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('change-password')
  changePassword(
    @UserId() userId: string,
    @Body() payload: { currentPassword: string; newPassword: string },
    @TrxDecorator() trx: Transaction
  ) {
    return this.usersService.changePassword({ userId, payload, trx });
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
