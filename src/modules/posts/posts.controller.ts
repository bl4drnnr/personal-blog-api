import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostsService } from '@posts/posts.service';
import { JwtGuard } from '@guards/jwt.guard';
import { CreatePostRequest } from '@posts/dto/create-post/request.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return await this.postsService.getPostBySlug({ slug });
  }

  @Get('id/:id')
  async getPostById(@Param('id') id: string) {
    return await this.postsService.getPostById({ id });
  }

  @UseGuards(JwtGuard)
  @Post()
  async createPost(@Body() post: CreatePostRequest) {
    return await this.postsService.createPost({ post });
  }
}
