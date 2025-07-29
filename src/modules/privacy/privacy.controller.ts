import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  UsePipes,
  Query
} from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import { UpdatePrivacyPageDto } from '@dto/update-privacy-page.dto';
import { CreatePrivacySectionDto } from '@dto/create-privacy-section.dto';
import { UpdatePrivacySectionDto } from '@dto/update-privacy-section.dto';
import { CreatePrivacyContentItemDto } from '@dto/create-privacy-content-item.dto';
import { UpdatePrivacyContentItemDto } from '@dto/update-privacy-content-item.dto';

@Controller('privacy')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  // Public endpoint for frontend SSR
  @Get('privacy')
  async getPrivacyPageData() {
    return await this.privacyService.getPrivacyPageData();
  }

  // Admin endpoint for privacy page settings (layout, SEO, etc.)
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/privacy/page')
  async updatePrivacyPage(
    @Body() data: UpdatePrivacyPageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.updatePrivacyPage({ data, trx });
  }

  // Admin endpoints for privacy sections
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/privacy/sections')
  async createPrivacySection(
    @Body() data: CreatePrivacySectionDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.createPrivacySection({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/privacy/sections/:id')
  async updatePrivacySection(
    @Param('id') sectionId: string,
    @Body() data: UpdatePrivacySectionDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.updatePrivacySection({ sectionId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/privacy/sections')
  async deletePrivacySection(
    @Query('id') sectionId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.deletePrivacySection({ sectionId, trx });
  }

  // Admin endpoints for privacy content items
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/privacy/content-items')
  async createPrivacyContentItem(
    @Body() data: CreatePrivacyContentItemDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.createPrivacyContentItem({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/privacy/content-items/:id')
  async updatePrivacyContentItem(
    @Param('id') itemId: string,
    @Body() data: UpdatePrivacyContentItemDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.updatePrivacyContentItem({ itemId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/privacy/content-items')
  async deletePrivacyContentItem(
    @Query('id') itemId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.deletePrivacyContentItem({ itemId, trx });
  }
}
