import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { ContactService } from '@modules/contact.service';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ContactDto } from '@dto/contact.dto';
import { AuthGuard } from '@guards/auth.guard';
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { UpdateContactPageDto } from '@dto/contact/requests/update-contact-page.dto';
import { CreateContactTileDto } from '@dto/contact/requests/create-contact-tile.dto';
import { UpdateContactTileDto } from '@dto/contact/requests/update-contact-tile.dto';
import { ReorderContactTilesDto } from '@dto/contact/requests/reorder-contact-tiles.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Public endpoint for frontend SSR
  @Get('contact')
  async getContactPageData() {
    return await this.contactService.getContactPageData();
  }

  @UsePipes(ValidationPipe)
  @Post('contact')
  contact(@Body() payload: ContactDto) {
    return this.contactService.contact({ payload });
  }

  // Admin endpoints for contact page management
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-contact-page')
  async getContactPageForAdmin() {
    return await this.contactService.getContactPageAdmin();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/update-contact-page')
  async updateContactPage(
    @Body() data: UpdateContactPageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.contactService.updateContactPage({ data, trx });
  }

  // Contact Tiles Management
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/tiles/create-tile')
  async createContactTile(@Body() data: CreateContactTileDto) {
    return await this.contactService.createContactTile(data);
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/tiles/update-tile')
  async updateContactTile(@Body() data: UpdateContactTileDto) {
    return await this.contactService.updateContactTile(data);
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/tiles/delete-tile')
  async deleteContactTile(@Query('id') tileId: string) {
    return await this.contactService.deleteContactTile(tileId);
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/tiles/reorder')
  async reorderContactTiles(@Body() data: ReorderContactTilesDto) {
    return await this.contactService.reorderContactTiles(data.tileIds);
  }

  // Contact Messages Management
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/messages/list')
  async getContactMessages(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('query') query?: string,
    @Query('status') status?: string
  ) {
    return await this.contactService.getContactMessages({
      page: page ? parseInt(page, 10) : 0,
      pageSize: pageSize ? parseInt(pageSize, 10) : 10,
      orderBy: orderBy || 'createdAt',
      order: order || 'DESC',
      query,
      status
    });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Put('admin/messages/mark-read')
  async markMessageAsRead(@Query('id') messageId: string) {
    return await this.contactService.markMessageAsRead(messageId);
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Put('admin/messages/mark-unread')
  async markMessageAsUnread(@Query('id') messageId: string) {
    return await this.contactService.markMessageAsUnread(messageId);
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/messages/delete')
  async deleteContactMessage(@Query('id') messageId: string) {
    return await this.contactService.deleteContactMessage(messageId);
  }
}
