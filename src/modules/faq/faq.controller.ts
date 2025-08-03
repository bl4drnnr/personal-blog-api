import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { AuthGuard } from '@guards/auth.guard';
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CreateFaqDto } from '@dto/faq/requests/create-faq.dto';
import { UpdateFaqDto } from '@dto/faq/requests/update-faq.dto';
import { GetFaqsDto } from '@dto/faq/requests/get-faqs.dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin')
  async getFaqs(@Query() query: GetFaqsDto) {
    return await this.faqService.findAll(query);
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-faq-by-id')
  async getFaqById(@Query('id') id: string) {
    return await this.faqService.findById(id);
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/create-faq')
  async createFaq(@Body() data: CreateFaqDto, @TrxDecorator() trx: Transaction) {
    return await this.faqService.create({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/update-faq')
  async updateFaq(
    @Query('id') id: string,
    @Body() data: UpdateFaqDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.faqService.update({ id, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/delete-faq')
  async deleteFaq(@Query('id') id: string, @TrxDecorator() trx: Transaction) {
    return await this.faqService.delete({ id, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/sort-order')
  async updateSortOrder(
    @Body() faqs: Array<{ id: string; sortOrder: number }>,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.faqService.updateSortOrder({ faqs, trx });
  }
}
