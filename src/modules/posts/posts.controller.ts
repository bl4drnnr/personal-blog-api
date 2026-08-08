import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ListPostsQueryDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'List published posts (paginated)' })
  @ApiOkResponse({ description: 'Page of posts with total count.' })
  list(@Query() query: ListPostsQueryDto) {
    return this.posts.listPublic(query);
  }

  @Get('slugs')
  @ApiOperation({ summary: 'List published slugs (for sitemap/RSS)' })
  @ApiOkResponse({ description: 'Array of { slug, type, updatedAt }.' })
  slugs() {
    return this.posts.listPublishedSlugs();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a published post by slug' })
  @ApiParam({ name: 'slug', example: 'abusing-oidc-token-exchange-in-ci-pipelines' })
  @ApiOkResponse({ description: 'The full post including markdown content.' })
  @ApiNotFoundResponse({ description: 'No published post with that slug.' })
  bySlug(@Param('slug') slug: string) {
    return this.posts.getPublicBySlug(slug);
  }
}
