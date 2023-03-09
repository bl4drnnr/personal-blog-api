import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostsService } from '@posts/posts.service';
import { CreatePostDto } from '@posts/dto/create-post.dto';
import { JwtGuard } from '@guards/jwt.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':slug')
  getPostBySlug(@Param('slug') slug: string) {
    return this.postsService.getPostBySlug({ slug });
  }

  @UseGuards(JwtGuard)
  @Post()
  createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost({ post });
  }
}
