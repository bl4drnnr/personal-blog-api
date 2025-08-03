import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
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

@Controller('privacy')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  // Public endpoint for frontend SSR
  @Get('')
  async getPrivacyPageData() {
    return await this.privacyService.getPrivacyPageData();
  }

  // Admin endpoint for privacy page data with raw IDs
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/privacy/get-page')
  async getPrivacyPageDataAdmin() {
    return await this.privacyService.getPrivacyPageDataAdmin();
  }

  // Admin endpoints for privacy sections list
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/privacy/get-sections')
  async getPrivacySections() {
    return await this.privacyService.getPrivacySections();
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
  @Post('admin/privacy/create-sections')
  async createPrivacySection(
    @Body() data: CreatePrivacySectionDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.createPrivacySection({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/privacy/update-sections')
  async updatePrivacySection(
    @Query('id') sectionId: string,
    @Body() data: UpdatePrivacySectionDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.updatePrivacySection({ sectionId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/privacy/delete-sections')
  async deletePrivacySection(
    @Query('id') sectionId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.deletePrivacySection({ sectionId, trx });
  }
}
