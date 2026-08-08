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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiPropertyOptional,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
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
  @ApiPropertyOptional({ description: 'Match against the S3 key' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 50, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  per: number = 50;
}

class UploadAssetDto {
  @ApiPropertyOptional({ maxLength: 300 })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  alt?: string;
}

@ApiTags('Assets')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@Controller('admin/assets')
@UseGuards(AccessTokenGuard)
export class AssetsAdminController {
  constructor(private readonly assets: AssetsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
  @ApiOperation({ summary: '[admin] Upload an image (10MB max)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
        alt: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'The stored asset, including its public URL.' })
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
  @ApiOperation({ summary: '[admin] List assets (paginated)' })
  list(@Query() query: ListAssetsQueryDto) {
    return this.assets.list(query.search, query.page, query.per);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: '[admin] Delete an asset (removes the S3 object too)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.assets.remove(id);
  }
}
