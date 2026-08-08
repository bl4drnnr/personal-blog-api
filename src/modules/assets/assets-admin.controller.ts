import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { AssetsService } from './assets.service';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
  'image/x-icon',
]);

class ListAssetsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  per: number = 50;
}

class UploadAssetDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  alt?: string;
}

@Controller('admin/assets')
@UseGuards(AccessTokenGuard)
export class AssetsAdminController {
  constructor(private readonly assets: AssetsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
  upload(@UploadedFile() file: Express.Multer.File | undefined, @Body() dto: UploadAssetDto) {
    if (!file) {
      throw new BadRequestException('Missing file field');
    }
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException(`Unsupported content type: ${file.mimetype}`);
    }
    return this.assets.upload(file, dto.alt);
  }

  @Get()
  list(@Query() query: ListAssetsQueryDto) {
    return this.assets.list(query.search, query.page, query.per);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.assets.remove(id);
  }
}
