import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { SocialLinksService } from './social-links.service';
import { AdminSocialLinkDto, PublicSocialLinkDto } from '@dto/social-link.dto';
import { UpdateSocialLinksDto } from '@dto/update-social-links.dto';
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import { TrxDecorator } from '@decorators/transaction.decorator';

@Controller('social-links')
export class SocialLinksController {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  @Get('get-social-links')
  async getPublicSocialLinks(): Promise<Array<PublicSocialLinkDto>> {
    return this.socialLinksService.getPublicSocialLinks();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-social-links')
  async getAdminSocialLinks(): Promise<Array<AdminSocialLinkDto>> {
    return this.socialLinksService.getAdminSocialLinks();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Put('admin/update-social-links')
  async updateSocialLinks(
    @Body() data: UpdateSocialLinksDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.socialLinksService.updateSocialLinks({
      data,
      trx
    });
  }
}
