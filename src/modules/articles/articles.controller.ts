import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { ArticlesService } from '@modules/articles.service';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { Transaction } from 'sequelize';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { CreateArticleDto } from '@dto/create-article.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { EditArticleDto } from '@dto/edit-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('get-all-posted-articles-slugs')
  getAllPostedArticlesSlugs(@TrxDecorator() trx: Transaction) {
    return this.articlesService.getAllPostedArticlesSlugs({ trx });
  }

  @Get('get-posted-by-slug')
  getPostedArticleBySlug(
    @Query('slug') slug: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.getPostedArticleBySlug({ slug, trx });
  }

  @UseGuards(AuthGuard)
  @Get('get-by-slug')
  getArticleBySlug(
    @Query('slug') slug: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.getArticleBySlug({ slug, trx });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create')
  createPost(
    @UserId() userId: string,
    @Body() payload: CreateArticleDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.createArticle({
      userId,
      payload,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @Patch('change-publish')
  changePublishArticleStatus(
    @Query('articleId') articleId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.changePublishArticleStatus({ articleId, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  deleteArticle(
    @Query('articleId') articleId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.deleteArticle({
      articleId,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('edit')
  editArticle(
    @Body() payload: EditArticleDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.editArticle({ payload, trx });
  }

  @UseGuards(AuthGuard)
  @Get('list')
  listArticles(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.articlesService.listArticles({
      query,
      page,
      pageSize,
      order,
      orderBy,
      trx
    });
  }
}
