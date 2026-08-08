import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { AdminListPostsQueryDto, CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@Controller('admin/posts')
@UseGuards(AccessTokenGuard)
export class PostsAdminController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  @ApiOperation({ summary: '[admin] List posts including drafts' })
  list(@Query() query: AdminListPostsQueryDto) {
    return this.posts.listAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '[admin] Get a post by id (draft or published)' })
  byId(@Param('id', ParseUUIDPipe) id: string) {
    return this.posts.getAdminById(id);
  }

  @Post()
  @ApiOperation({ summary: '[admin] Create a post' })
  @ApiConflictResponse({ description: 'Slug already in use.' })
  create(@Body() dto: CreatePostDto) {
    return this.posts.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '[admin] Update a post (first publish stamps publishedAt)' })
  @ApiConflictResponse({ description: 'Slug already in use.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePostDto) {
    return this.posts.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: '[admin] Delete a post' })
  @ApiNoContentResponse({ description: 'Deleted.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.posts.remove(id);
  }
}
