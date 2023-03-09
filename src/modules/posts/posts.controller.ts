import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from '@posts/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':slug')
  getPostBySlug(@Param('slug') slug: string) {
    return this.postsService.getPostBySlug({ slug });
  }
}
