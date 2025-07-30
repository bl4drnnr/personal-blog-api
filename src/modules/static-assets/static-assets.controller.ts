import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { StaticAssetsService } from './static-assets.service';
import { AuthGuard } from '@guards/auth.guard';
import { Transaction } from 'sequelize';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { CreateStaticAssetDto } from '@dto/static-assets/requests/create-static-asset.dto';
import { UpdateStaticAssetDto } from '@dto/static-assets/requests/update-static-asset.dto';
import { UploadFileDto } from '@dto/static-assets/requests/upload-file.dto';
import { UploadBase64Dto } from '@dto/static-assets/requests/upload-base64.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { BasicAuthGuard } from '@guards/basic-auth.guard';

@Controller('static-assets')
export class StaticAssetsController {
  constructor(private readonly staticAssetsService: StaticAssetsService) {}

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/assets')
  async getAllAssets(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('includePicture') includePicture?: string
  ) {
    return this.staticAssetsService.findAll({
      search,
      page,
      pageSize,
      orderBy,
      order,
      includePicture
    });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/assets/:id')
  async getAssetById(@Param('id') id: string) {
    return this.staticAssetsService.findById(id);
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/assets/create')
  async createAsset(
    @Body() data: CreateStaticAssetDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.staticAssetsService.create({ data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/assets/:id/update')
  async updateAsset(
    @Param('id') id: string,
    @Body() data: UpdateStaticAssetDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.staticAssetsService.update({ id, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/assets/delete')
  async deleteAsset(@Query('id') id: string, @TrxDecorator() trx: Transaction) {
    return this.staticAssetsService.delete({ id, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/assets/upload-file')
  async uploadFile(
    @Body() { base64File, name, description }: UploadFileDto,
    @TrxDecorator() trx?: Transaction
  ) {
    return this.staticAssetsService.uploadFileFromBase64({
      base64File,
      name,
      description,
      trx
    });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/assets/upload-base64')
  async uploadBase64Image(
    @Body() { base64Image, name, description }: UploadBase64Dto,
    @TrxDecorator() trx?: Transaction
  ) {
    return this.staticAssetsService.uploadBase64Image({
      base64File: base64Image,
      name,
      description,
      trx
    });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/assets/:id/update-file')
  async updateAssetWithFile(
    @Param('id') id: string,
    @Body() data: UpdateStaticAssetDto & { base64File?: string },
    @TrxDecorator() trx: Transaction
  ) {
    if (data.base64File) {
      return this.staticAssetsService.updateFileFromBase64({
        id,
        base64File: data.base64File,
        data,
        trx
      });
    } else {
      return this.staticAssetsService.update({ id, data, trx });
    }
  }
}
