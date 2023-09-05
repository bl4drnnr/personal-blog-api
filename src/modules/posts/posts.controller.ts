import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { PostsService } from '@posts/posts.service';
import { CreatePostDto } from '@dto/create-post.dto';
import { UpdatePostDto } from '@dto/update-post.dto';
import { AuthGuard } from '@guards/jwt.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('get-by-slug')
  async getPostBySlug(
    @Query('slug') slug: string,
    @Query('language') language: string
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
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
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

  @UseGuards(AuthGuard)
  @Post('create')
  async createPost(@Body() post: CreatePostDto) {
    return await this.postsService.createPost(post);
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  async updatePost(@Query('id') id: string, @Body() post: UpdatePostDto) {
    return await this.postsService.updatePost({ id, post });
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  async deletePost(@Query('id') id: string) {
    return await this.postsService.deletePost({ id });
  }
}
