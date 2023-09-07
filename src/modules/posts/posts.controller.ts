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
  getPostBySlug(
    @Query('slug') slug: string,
    @Query('language') language: string
  ) {
    return this.postsService.getPostBySlug({ slug, language });
  }

  @Get('get-by-id')
  getPostById(@Query('id') id: string) {
    return this.postsService.getPostById({ id });
  }

  @Get('all')
  getAllPosts(
    @Query('language') language: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @Query('searchQuery') searchQuery: string,
    @Query('postTypes') postTypes: string
  ) {
    return this.postsService.getAllPosts({
      language,
      page,
      pageSize,
      order,
      orderBy,
      searchQuery,
      postTypes
    });
  }

  @Get('get-all-slugs')
  getAllSlugs() {
    return this.postsService.getAllSlugs();
  }

  @UseGuards(AuthGuard)
  @Post('create')
  createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  updatePost(@Query('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost({ id, post });
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  deletePost(@Query('id') id: string) {
    return this.postsService.deletePost({ id });
  }

  @Get('get-available-languages')
  getAvailableLanguages() {
    return this.postsService.getAvailableLanguages();
  }
}
