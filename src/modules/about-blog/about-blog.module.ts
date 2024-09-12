import { Module } from '@nestjs/common';
import { AboutBlogController } from './about-blog.controller';
import { AboutBlogService } from './about-blog.service';

@Module({
  controllers: [AboutBlogController],
  providers: [AboutBlogService]
})
export class AboutBlogModule {}
