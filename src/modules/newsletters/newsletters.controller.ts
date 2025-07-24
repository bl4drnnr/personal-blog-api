import { Body, Controller, Post, Query, UsePipes } from '@nestjs/common';
import { NewslettersService } from '@modules/newsletters/newsletters.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ValidationPipe } from '@pipes/validation.pipe';
import { SubscribeToNewslettersDto } from '@dto/subscribe-to-newsletters.dto';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  @UsePipes(ValidationPipe)
  @Post('subscribe')
  subscribeToNewsletters(
    @Body() payload: SubscribeToNewslettersDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.newslettersService.subscribeToNewsletters({
      payload,
      trx
    });
  }

  @Post('confirm-newsletters-subscription')
  confirmNewslettersSubscription(
    @Query('newslettersId') newslettersId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.newslettersService.confirmNewslettersSubscription({
      newslettersId,
      trx
    });
  }

  @Post('unsubscribe-from-newsletters')
  unsubscribeFromNewsletters(
    @Query('newslettersId') newslettersId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.newslettersService.unsubscribeFromNewsletters({
      newslettersId,
      trx
    });
  }
}
