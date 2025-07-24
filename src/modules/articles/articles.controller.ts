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
import { CreateArticleDto } from '@dto/articles/requests/create-article.dto';
import { ValidationPipe } from '@pipes/validation.pipe';

@Controller()
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

  // Admin endpoints
  @UseGuards(AuthGuard)
  @Get('admin/posts')
  async getAdminPosts(
    @UserId() userId: string,
    @Query('published') published?: string
  ) {
    return this.articlesService.getAdminPosts({ userId, published });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('admin/posts')
  async createPost(
    @Body() data: CreateArticleDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.create({ data, userId, trx });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/posts/:id')
  async updatePost(
    @Param('id') articleId: string,
    @Body() data: Partial<CreateArticleDto>,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.update({ articleId, data, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('admin/posts/:id')
  async deletePost(
    @Param('id') articleId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.delete({ articleId, trx });
  }

  @UseGuards(AuthGuard)
  @Put('admin/posts/:id/publish')
  async togglePublishStatus(
    @Param('id') articleId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.togglePublished({ articleId, trx });
  }
}
