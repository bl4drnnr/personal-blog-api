import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CreatePageDto } from '@dto/create-page.dto';
import { UpdatePageDto } from '@dto/update-page.dto';
import { UserId } from '@decorators/user-id.decorator';

@Controller()
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  // Public endpoints
  @Get('pages')
  async getPages() {
    return await this.pagesService.findAll();
  }

  @Get('pages/slugs')
  async getPageSlugs() {
    return await this.pagesService.getSlugs();
  }

  @Get('pages/:slug')
  async getPageBySlug(@Param('slug') slug: string) {
    return await this.pagesService.getPageBySlug({ slug });
  }

  // Admin endpoints
  @UseGuards(AuthGuard)
  @Get('admin/pages')
  async getAdminPages() {
    return await this.pagesService.findAllAdmin();
  }

  @UseGuards(AuthGuard)
  @Get('admin/pages/:slug')
  async getAdminPageBySlug(@Param('slug') slug: string) {
    return await this.pagesService.getPageBySlugAdmin({ slug });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/pages')
  async createPage(
    @Body() data: CreatePageDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.pagesService.create({ data, userId, trx });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/pages/:id')
  async updatePage(
    @Param('id') pageId: string,
    @Body() data: UpdatePageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.pagesService.update({ pageId, data, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('admin/pages/:id')
  async deletePage(@Param('id') pageId: string, @TrxDecorator() trx: Transaction) {
    return await this.pagesService.delete({ pageId, trx });
  }
}
