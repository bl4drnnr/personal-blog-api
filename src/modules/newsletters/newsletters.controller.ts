import {
  Body,
  Controller,
  Post,
  Query,
  UsePipes,
  Get,
  Put,
  UseGuards,
  Delete
} from '@nestjs/common';
import { NewslettersService } from '@modules/newsletters/newsletters.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ValidationPipe } from '@pipes/validation.pipe';
import { SubscribeToNewslettersDto } from '@dto/subscribe-to-newsletters.dto';
import { UpdateSubscribePageDto } from '@dto/subscribe/requests/update-subscribe-page.dto';
import { AuthGuard } from '@guards/auth.guard';
import { BasicAuthGuard } from '@guards/basic-auth.guard';

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
    @Query('id') newslettersId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.newslettersService.confirmNewslettersSubscription({
      newslettersId,
      trx
    });
  }

  @Post('unsubscribe-from-newsletters')
  unsubscribeFromNewsletters(
    @Query('id') newslettersId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.newslettersService.unsubscribeFromNewsletters({
      newslettersId,
      trx
    });
  }

  // Public endpoint for frontend SSR
  @Get('subscribe')
  async getSubscribePageData() {
    return await this.newslettersService.getSubscribePageData();
  }

  // Admin endpoints for subscribe page management
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-subscribe-page')
  async getSubscribePageForAdmin() {
    return await this.newslettersService.getSubscribePageAdmin();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/update-subscribe-page')
  async updateSubscribePage(@Body() data: UpdateSubscribePageDto) {
    return await this.newslettersService.updateSubscribePage(data);
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/list-subscriptions')
  async listSubscriptions(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy?: string,
    @Query('query') query?: string,
    @Query('status') status?: string
  ) {
    return await this.newslettersService.listSubscriptions({
      page,
      pageSize,
      order,
      orderBy,
      query,
      status
    });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/delete-subscription')
  async deleteSubscription(
    @Query('id') id: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.newslettersService.deleteSubscription(id, trx);
  }
}
