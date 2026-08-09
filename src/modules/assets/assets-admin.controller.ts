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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { AssetsService } from './assets.service';
import { ListAssetsQueryDto, UploadAssetDto } from './dto/assets.dto';
import { EXTENSION_BY_MIME, matchesDeclaredType } from './mime';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
    if (!EXTENSION_BY_MIME[file.mimetype]) {
      throw new BadRequestException(`Unsupported content type: ${file.mimetype}`);
    }
    if (!matchesDeclaredType(file.buffer, file.mimetype)) {
      throw new BadRequestException(`File contents are not a valid ${file.mimetype}`);
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
