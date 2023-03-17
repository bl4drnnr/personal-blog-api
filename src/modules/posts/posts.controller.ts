import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { PostsService } from '@posts/posts.service';
import { JwtGuard } from '@guards/jwt.guard';
import { CreatePostRequest } from '@posts/dto/create-post/request.dto';
import { UpdatePostRequest } from '@posts/dto/update-post/request.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':language/:slug')
  async getPostBySlug(
    @Param('slug') slug: string,
    @Param('language') language: string
  ) {
    return await this.postsService.getPostBySlug({ slug, language });
  }

  @Get('get-by-id')
  async getPostById(@Query('id') id: string) {
    return await this.postsService.getPostById({ id });
  }

  @Get('all')
  async getAllPosts(
    @Query('language') language: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @Query('searchQuery') searchQuery: string,
    @Query('postTypes') postTypes: string
  ) {
    return await this.postsService.getAllPosts({
      language,
      page,
      pageSize,
      order,
      orderBy,
      searchQuery,
      postTypes
    });
  }

  @UseGuards(JwtGuard)
  @Post('create')
  async createPost(@Body() post: CreatePostRequest) {
    return await this.postsService.createPost({ post });
  }

  @UseGuards(JwtGuard)
  @Patch('update')
  async updatePost(@Query('id') id: string, @Body() post: UpdatePostRequest) {
    return await this.postsService.updatePost({ id, post });
  }

  @UseGuards(JwtGuard)
  @Delete('delete')
  async deletePost(@Query('id') id: string) {
    return await this.postsService.deletePost({ id });
  }
}
