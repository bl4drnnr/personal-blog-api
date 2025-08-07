import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { Transaction } from 'sequelize';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { CreateArticleDto } from '@dto/create-article.dto';
import { UpdateArticleDto } from '@dto/update-article.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { BasicAuthGuard } from '@guards/basic-auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Public endpoints for frontend
  @Get('posts')
  async getAllPosts() {
    return this.articlesService.findAllPublished();
  }

  @Get('posts/slugs')
  async getPostsSlugs() {
    return this.articlesService.getSlugs();
  }

  @Get('posts/:slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return this.articlesService.getPublishedPostBySlug({ slug });
  }

  @Get('blog')
  async getBlogPage(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.articlesService.getBlogPageData({ search, page, limit });
  }

  // Admin endpoints
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/list-posts')
  async getAdminPosts(
    @UserId() userId: string,
    @Query('published') published?: string,
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('orderBy') orderBy?: string
  ) {
    return await this.articlesService.getAdminPosts({
      userId,
      published,
      query,
      page: page ? parseInt(page + 1, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      order,
      orderBy
    });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/create-post')
  async createPost(
    @Body() data: CreateArticleDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.create({ data, userId, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/edit-post')
  async updatePost(
    @Query('id') articleId: string,
    @Body() data: UpdateArticleDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.update({ articleId, data, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Delete('admin/delete-post')
  async deletePost(
    @Query('id') articleId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.delete({ articleId, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Put('admin/change-post-public-status')
  async togglePublishStatus(
    @Query('id') articleId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.togglePublished({ articleId, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Put('admin/change-post-featured-status')
  async toggleFeaturedStatus(
    @Query('id') articleId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.toggleFeatured({ articleId, trx });
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-post')
  async getPostForAdmin(@Query('slug') slug: string) {
    return this.articlesService.getPostBySlugForAdmin({ slug });
  }
}
