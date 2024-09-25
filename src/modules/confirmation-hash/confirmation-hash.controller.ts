import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';

@Controller('confirmation-hash')
export class ConfirmationHashController {
  constructor(private readonly confirmationHashService: ConfirmationHashService) {}

  @Get('account-confirmation')
  confirmAccount(
    @TrxDecorator() trx: Transaction,
    @Query('confirmationHash') confirmationHash: string
  ) {
    return this.confirmationHashService.confirmAccount({
      confirmationHash,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('reset-user-password-confirmation')
  confirmResetUserPassword(
    @Query('confirmationHash') confirmationHash: string,
    @Body() payload: ResetUserPasswordDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.confirmationHashService.confirmResetUserPassword({
      hash: confirmationHash,
      payload,
      trx
    });
  }
}
