import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

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
}
