import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListPostsQueryDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  list(@Query() query: ListPostsQueryDto) {
    return this.posts.listPublic(query);
  }

  @Get('slugs')
  slugs() {
    return this.posts.listPublishedSlugs();
  }

  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.posts.getPublicBySlug(slug);
  }
}
