import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

  @Get('id/:id')
  async getPostById(@Param('id') id: string) {
    return await this.postsService.getPostById({ id });
  }

  @Get('all/:language/:page/:pageSize/:order/:orderBy')
  async getAllPosts(
    @Param('language') language: string,
    @Param('page') page: number,
    @Param('pageSize') pageSize: number,
    @Param('order') order: string,
    @Param('orderBy') orderBy: string
  ) {
    return await this.postsService.getAllPosts({
      language,
      page,
      pageSize,
      order,
      orderBy
    });
  }

  @Get('search/:language/:searchString')
  async searchPosts(
    @Param('searchString') searchString: string,
    @Param('language') language: string
  ) {
    return await this.postsService.searchPosts({ searchString, language });
  }

  @UseGuards(JwtGuard)
  @Post()
  async createPost(@Body() post: CreatePostRequest) {
    return await this.postsService.createPost({ post });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updatePost(@Param('id') id: string, @Body() post: UpdatePostRequest) {
    return await this.postsService.updatePost({ id, post });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return await this.postsService.deletePost({ id });
  }
}
