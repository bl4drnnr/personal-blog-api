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
  async getBlogPage(@Query() { page, limit, search, tag }: BlogQuery) {
    return this.blogService.getBlogPageData({
      page,
      limit,
      search,
      tag
    });
  }

  @Get('tags')
  async getAllTags() {
    return this.blogService.getAllTags();
  }
}
