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
import { MenuService } from './menu.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CreateMenuPageDto } from '@dto/menu/requests/create-menu-page.dto';
import { UpdateMenuPageDto } from '@dto/menu/requests/update-menu-page.dto';
import { CreateMenuTileDto } from '@dto/menu/requests/create-menu-tile.dto';
import { UpdateMenuTileDto } from '@dto/menu/requests/update-menu-tile.dto';
import { BasicAuthGuard } from '@guards/basic-auth.guard';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Public endpoint for frontend SSR
  @Get()
  async getMenuPageData() {
    return await this.menuService.getMenuPage();
  }

  // Admin endpoints for menu page content
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-menu')
  async getAdminMenuPageData() {
    return await this.menuService.getMenuPageDataAdmin();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/create-menu')
  async createMenuPage(
    @Body() data: CreateMenuPageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.menuService.createMenuPage({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/update-menu')
  async updateMenuPage(
    @Query('id') menuPageId: string,
    @Body() data: UpdateMenuPageDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.menuService.updateMenuPage({ menuPageId, data, trx });
  }

  // Menu Tile Admin Endpoints
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-tiles')
  async getMenuTiles() {
    return await this.menuService.getMenuTiles();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/create-tiles')
  async createMenuTile(
    @Body() data: CreateMenuTileDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.menuService.createMenuTile({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/update-tiles')
  async updateMenuTile(
    @Query('id') menuTileId: string,
    @Body() data: UpdateMenuTileDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.menuService.updateMenuTile({ menuTileId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/delete-tiles')
  async deleteMenuTile(
    @Query('id') menuTileId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.menuService.deleteMenuTile({ menuTileId, trx });
  }
}
