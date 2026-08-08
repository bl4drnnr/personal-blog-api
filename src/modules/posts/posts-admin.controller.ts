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
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { AdminListPostsQueryDto, CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@Controller('admin/posts')
@UseGuards(AccessTokenGuard)
export class PostsAdminController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  list(@Query() query: AdminListPostsQueryDto) {
    return this.posts.listAdmin(query);
  }

  @Get(':id')
  byId(@Param('id', ParseUUIDPipe) id: string) {
    return this.posts.getAdminById(id);
  }

  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.posts.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePostDto) {
    return this.posts.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.posts.remove(id);
  }
}
