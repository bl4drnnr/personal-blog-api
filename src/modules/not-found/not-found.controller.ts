import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { NotFoundService } from './not-found.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CreateNotFoundPageDto } from '@dto/not-found/requests/create-not-found-page.dto';
import { UpdateNotFoundPageDto } from '@dto/not-found/requests/update-not-found-page.dto';
import { BasicAuthGuard } from '@guards/basic-auth.guard';

@Controller('not-found')
export class NotFoundController {
  constructor(private readonly notFoundService: NotFoundService) {}

  // Public endpoint for frontend SSR
  @Get('get-not-found')
  async getNotFoundPageData() {
    return await this.notFoundService.getNotFoundPageData();
  }

  // Admin endpoints for not found page content
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-not-found')
  async getAdminNotFoundPageData() {
    return await this.notFoundService.getNotFoundPageDataAdmin();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/create-not-found')
  async createNotFoundPage(
    @Body() data: CreateNotFoundPageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.notFoundService.createNotFoundPage({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/update-not-found')
  async updateNotFoundPage(
    @Body() data: UpdateNotFoundPageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.notFoundService.updateNotFoundPage({
      data,
      trx
    });
  }
}
