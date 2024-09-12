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
import { AboutBlogService } from '@modules/about-blog.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { CreateAuthorDto } from '@dto/create-author.dto';
import { UserId } from '@decorators/user-id.decorator';
import { ValidationPipe } from '@pipes/validation.pipe';
import { UpdateAuthorSelectionStatusDto } from '@dto/update-author-selection-status.dto';
import { UpdateAuthorDto } from '@dto/update-author.dto';

@Controller('about-blog')
export class AboutBlogController {
  constructor(private readonly aboutBlogService: AboutBlogService) {}

  @Get('get-selected-author')
  getSelectedAuthor(@TrxDecorator() trx: Transaction) {
    return this.aboutBlogService.getSelectedAuthor({ trx });
  }

  @Get('get-selected-experiences')
  getSelectedExperiences(@TrxDecorator() trx: Transaction) {
    return this.aboutBlogService.getSelectedExperiences({ trx });
  }

  @Get('get-selected-certifications')
  getSelectedCertifications(@TrxDecorator() trx: Transaction) {
    return this.aboutBlogService.getSelectedCertifications({ trx });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create-author')
  createAuthor(
    @UserId() userId: string,
    @Body() payload: CreateAuthorDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.createAuthor({ userId, payload, trx });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('update-author')
  updateAuthor(
    @Body() payload: UpdateAuthorDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.updateAuthor({ payload, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('delete-author')
  deleteAuthor(
    @Query('authorId') authorId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.deleteAuthor({ authorId, trx });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('update-author-selection-status')
  changeAuthorSelectionStatus(
    @Body() payload: UpdateAuthorSelectionStatusDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.changeAuthorSelectionStatus({
      payload,
      trx
    });
  }
}
