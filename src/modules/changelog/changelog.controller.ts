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
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import { CreateChangelogEntryDto } from '@dto/create-changelog-entry.dto';
import { UpdateChangelogEntryDto } from '@dto/update-changelog-entry.dto';
import { UpdateChangelogPageDto } from '@dto/update-changelog-page.dto';

@Controller()
export class ChangelogController {
  constructor(private readonly changelogService: ChangelogService) {}

  // Public endpoint for frontend SSR
  @Get('changelog')
  async getChangelogPageData() {
    return await this.changelogService.getChangelogPageData();
  }

  // Admin endpoints for changelog entries
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/changelog/entries')
  async getChangelogEntries() {
    return await this.changelogService.getChangelogEntries();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/changelog/entries')
  async createChangelogEntry(
    @Body() data: CreateChangelogEntryDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.changelogService.createChangelogEntry({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/changelog/entries/:id')
  async updateChangelogEntry(
    @Param('id') entryId: string,
    @Body() data: UpdateChangelogEntryDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.changelogService.updateChangelogEntry({ entryId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/changelog/entries/:id')
  async deleteChangelogEntry(
    @Param('id') entryId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.changelogService.deleteChangelogEntry({ entryId, trx });
  }

  // Admin endpoint for changelog page settings (layout, SEO, etc.)
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/changelog/page')
  async updateChangelogPage(
    @Body() data: UpdateChangelogPageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.changelogService.updateChangelogPage({ data, trx });
  }
}
