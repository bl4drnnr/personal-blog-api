import { Controller, Get, Query } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller('confirmation-hash')
export class ConfirmationHashController {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService
  ) {}

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
}
