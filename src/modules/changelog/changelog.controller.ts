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
import { ChangelogService } from './changelog.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller()
export class ChangelogController {
  constructor(private readonly changelogService: ChangelogService) {}

  // Public endpoint for frontend SSR
  @Get('changelog')
  async getChangelogPageData() {
    return await this.changelogService.getChangelogPageData();
  }

  // Admin endpoints for changelog entries
  @UseGuards(AuthGuard)
  @Get('admin/changelog/entries')
  async getChangelogEntries() {
    return await this.changelogService.getChangelogEntries();
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/changelog/entries')
  async createChangelogEntry(
    @Body()
    data: {
      version: string;
      date: string;
      title: string;
      description: string;
      changes: string[];
      sortOrder?: number;
    },
    @TrxDecorator() trx: Transaction
  ) {
    return await this.changelogService.createChangelogEntry({ data, trx });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/changelog/entries/:id')
  async updateChangelogEntry(
    @Param('id') entryId: string,
    @Body()
    data: {
      version?: string;
      date?: string;
      title?: string;
      description?: string;
      changes?: string[];
      sortOrder?: number;
    },
    @TrxDecorator() trx: Transaction
  ) {
    return await this.changelogService.updateChangelogEntry({ entryId, data, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('admin/changelog/entries/:id')
  async deleteChangelogEntry(
    @Param('id') entryId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.changelogService.deleteChangelogEntry({ entryId, trx });
  }

  // Admin endpoint for changelog page settings (layout, SEO, etc.)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/changelog/page')
  async updateChangelogPage(
    @Body()
    data: {
      title?: string;
      content?: string;
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
    return await this.changelogService.updateChangelogPage({ data, trx });
  }
}
