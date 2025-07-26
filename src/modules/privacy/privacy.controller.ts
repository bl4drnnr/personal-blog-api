import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller()
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  // Public endpoint for frontend SSR
  @Get('privacy')
  async getPrivacyPageData() {
    return await this.privacyService.getPrivacyPageData();
  }

  // Admin endpoint for privacy page settings (layout, SEO, etc.)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/privacy/page')
  async updatePrivacyPage(
    @Body()
    data: {
      title?: string;
      lastUpdated?: string;
      cookiePolicyTitle?: string;
      footerText?: string;
      heroImageMain?: string;
      heroImageSecondary?: string;
      heroImageMainAlt?: string;
      heroImageSecondaryAlt?: string;
      logoText?: string;
      breadcrumbText?: string;
      heroTitle?: string;
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
      structuredData?: object;
    },
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.updatePrivacyPage({ data, trx });
  }

  // Admin endpoints for privacy sections
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/privacy/sections')
  async createPrivacySection(
    @Body()
    data: {
      title: string;
      sortOrder?: number;
      sectionType?: 'main' | 'cookie_policy';
    },
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.createPrivacySection({ data, trx });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/privacy/sections/:id')
  async updatePrivacySection(
    @Param('id') sectionId: string,
    @Body()
    data: {
      title?: string;
      sortOrder?: number;
      sectionType?: 'main' | 'cookie_policy';
    },
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.updatePrivacySection({ sectionId, data, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('admin/privacy/sections/:id')
  async deletePrivacySection(
    @Param('id') sectionId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.deletePrivacySection({ sectionId, trx });
  }

  // Admin endpoints for privacy content items
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/privacy/content-items')
  async createPrivacyContentItem(
    @Body()
    data: {
      privacySectionId: string;
      type: string;
      text?: string;
      items?: string[];
      linkText?: string;
      linkUrl?: string;
      sortOrder?: number;
    },
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.createPrivacyContentItem({ data, trx });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/privacy/content-items/:id')
  async updatePrivacyContentItem(
    @Param('id') itemId: string,
    @Body()
    data: {
      type?: string;
      text?: string;
      items?: string[];
      linkText?: string;
      linkUrl?: string;
      sortOrder?: number;
    },
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.updatePrivacyContentItem({ itemId, data, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('admin/privacy/content-items/:id')
  async deletePrivacyContentItem(
    @Param('id') itemId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.privacyService.deletePrivacyContentItem({ itemId, trx });
  }
}
