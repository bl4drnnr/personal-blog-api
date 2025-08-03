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
import { HomeService } from './home.service';
import { AuthGuard } from '@guards/auth.guard';
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CreateWhysSectionDto } from '@dto/whys-section/requests/create-whys-section.dto';
import { UpdateWhysSectionDto } from '@dto/whys-section/requests/update-whys-section.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  // Public endpoint for frontend SSR
  @Get('home')
  async getHomePageData() {
    return await this.homeService.getHomePageData();
  }

  // Admin endpoints for whys section management
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-whys-sections')
  async getWhysSections() {
    return await this.homeService.getWhysSections();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/create-whys-sections')
  async createWhysSection(
    @Body() data: CreateWhysSectionDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.homeService.createWhysSection({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/update-whys-sections')
  async updateWhysSection(
    @Query('id') whysSectionId: string,
    @Body() data: UpdateWhysSectionDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.homeService.updateWhysSection({ whysSectionId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/delete-whys-sections')
  async deleteWhysSection(
    @Query('id') whysSectionId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.homeService.deleteWhysSection({ whysSectionId, trx });
  }
}
