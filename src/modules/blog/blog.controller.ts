import { Controller, Get, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

interface BlogQuery {
  page?: string;
  limit?: string;
  search?: string;
  tag?: string;
}

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getBlogPage(@Query() query: BlogQuery) {
    const { page, limit, search, tag } = query;

    return this.blogService.getBlogPageData({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      tag
    });
  }

  @Get('tags')
  async getAllTags() {
    return this.blogService.getAllTags();
  }
}
