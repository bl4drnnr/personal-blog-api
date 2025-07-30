import { Body, Controller, Get, Put, UseGuards, UsePipes } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { UpdateSiteConfigDto } from '@dto/update-site-config.dto';
import { BasicAuthGuard } from '@guards/basic-auth.guard';

@Controller('site-config')
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  // Public endpoint for frontend
  @Get('site/config')
  async getSiteConfig() {
    return await this.siteConfigService.getPublicConfig();
  }

  // Admin endpoints
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/site/get-config')
  async getAdminSiteConfig() {
    return await this.siteConfigService.getConfig();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/site/update-config')
  async updateSiteConfig(
    @Body() data: UpdateSiteConfigDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.siteConfigService.updateConfig({ data, trx });
  }
}
