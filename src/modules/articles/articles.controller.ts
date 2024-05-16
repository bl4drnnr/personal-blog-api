import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ArticlesService } from '@modules/articles.service';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { Transaction } from 'sequelize';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { CreateArticleDto } from '@dto/create-article.dto';
import { ValidationPipe } from '@pipes/validation.pipe';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly postsService: ArticlesService) {}

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create')
  createPost(
    @UserId() userId: string,
    @Body() payload: CreateArticleDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.postsService.createPost({
      userId,
      payload,
      trx
    });
  }
}
