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
import { LicenseService } from './license.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import { CreateLicenseTileDto } from '@dto/create-license-tile.dto';
import { UpdateLicenseTileDto } from '@dto/update-license-tile.dto';
import { UpdateLicensePageDto } from '@dto/update-license-page.dto';

@Controller()
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  // Public endpoint for frontend SSR
  @Get('license')
  async getLicensePageData() {
    return await this.licenseService.getLicensePageData();
  }

  // Admin endpoints for license tiles
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/license/tiles')
  async getLicenseTiles() {
    return await this.licenseService.getLicenseTiles();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/license/tiles')
  async createLicenseTile(
    @Body() data: CreateLicenseTileDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.licenseService.createLicenseTile({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/license/tiles/:id')
  async updateLicenseTile(
    @Param('id') tileId: string,
    @Body() data: UpdateLicenseTileDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.licenseService.updateLicenseTile({ tileId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/license/tiles/:id')
  async deleteLicenseTile(
    @Param('id') tileId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.licenseService.deleteLicenseTile({ tileId, trx });
  }

  // Admin endpoint for license page settings (layout, SEO, etc.)
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/license/page')
  async updateLicensePage(
    @Body() data: UpdateLicensePageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.licenseService.updateLicensePage({ data, trx });
  }
}
