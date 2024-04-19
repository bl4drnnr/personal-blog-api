import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { PostsService } from '@modules/posts/posts.service';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { Transaction } from 'sequelize';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { CreatePostDto } from '@dto/create-post.dto';
import { ValidationPipe } from '@pipes/validation.pipe';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create')
  createPost(
    @UserId() userId: string,
    @Body() payload: CreatePostDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.postsService.createPost({
      userId,
      payload,
      trx
    });
  }
}
