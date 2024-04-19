import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from '@modules/users.service';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('user-info')
  getUserInfo(@UserId() userId: string, @TrxDecorator() trx: Transaction) {
    return this.usersService.getUserInfo({ userId, trx });
  }
}
