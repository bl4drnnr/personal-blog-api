import { Controller, Get, Query } from '@nestjs/common';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ConfirmationHashService } from '@confirmation-hash/confirmation-hash.service';

@Controller('confirmation-hash')
export class ConfirmationHashController {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService
  ) {}

  @Get('account-confirmation')
  confirmAccount(
    @TransactionParam() trx: Transaction,
    @Query('confirmationHash') confirmationHash: string
  ) {
    return this.confirmationHashService.confirmAccount({
      confirmationHash,
      trx
    });
  }
}
