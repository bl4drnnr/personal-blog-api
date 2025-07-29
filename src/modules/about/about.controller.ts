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
import { AboutService } from './about.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CreateAboutPageDto } from '@dto/create-about-page.dto';
import { UpdateAboutPageDto } from '@dto/update-about-page.dto';
import { CreateExperienceDto } from '@dto/create-experience.dto';
import { UpdateExperienceDto } from '@dto/update-experience.dto';
import { CreateCertificateDto } from '@dto/create-certificate.dto';
import { UpdateCertificateDto } from '@dto/update-certificate.dto';
import { BasicAuthGuard } from '@guards/basic-auth.guard';

@Controller()
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  // Public endpoint for frontend SSR
  @Get('about')
  async getAboutPageData() {
    return await this.aboutService.getAboutPageData();
  }

  // Admin endpoints for about page content
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/about')
  async getAdminAboutPageData() {
    return await this.aboutService.getAboutPageDataAdmin();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/about')
  async createAboutPage(
    @Body() data: CreateAboutPageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.aboutService.createAboutPage({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/about/:id')
  async updateAboutPage(
    @Param('id') aboutPageId: string,
    @Body() data: UpdateAboutPageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.aboutService.updateAboutPage({ aboutPageId, data, trx });
  }

  // Admin endpoints for experiences
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/experiences')
  async getExperiences() {
    return await this.aboutService.getExperiences();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/experiences')
  async createExperience(
    @Body() data: CreateExperienceDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.aboutService.createExperience({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/experiences/:id')
  async updateExperience(
    @Param('id') experienceId: string,
    @Body() data: UpdateExperienceDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.aboutService.updateExperience({ experienceId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/experiences/:id')
  async deleteExperience(
    @Param('id') experienceId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.aboutService.deleteExperience({ experienceId, trx });
  }

  // Admin endpoints for certificates
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/certificates')
  async getCertificates() {
    return await this.aboutService.getCertificates();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/certificates')
  async createCertificate(
    @Body() data: CreateCertificateDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.aboutService.createCertificate({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/certificates/:id')
  async updateCertificate(
    @Param('id') certificateId: string,
    @Body() data: UpdateCertificateDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.aboutService.updateCertificate({ certificateId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/certificates/:id')
  async deleteCertificate(
    @Param('id') certificateId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.aboutService.deleteCertificate({ certificateId, trx });
  }
}
