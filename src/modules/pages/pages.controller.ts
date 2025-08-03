import { Body, Controller, Get, Put, UseGuards, UsePipes } from '@nestjs/common';
import { PagesService } from './pages.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { UpdateHomePageDto } from '@dto/pages/requests/update-home-page.dto';
import { BasicAuthGuard } from '@guards/basic-auth.guard';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  // Home page management endpoints
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-home')
  async getAdminHomePageData() {
    return await this.pagesService.getHomePageDataAdmin();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/put-home')
  async updateHomePage(
    @Body() data: UpdateHomePageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.pagesService.updateHomePage({ data, trx });
  }
}
