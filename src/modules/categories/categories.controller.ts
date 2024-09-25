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
import { CategoriesService } from '@modules/categories.service';
import { ValidationPipe } from '@pipes/validation.pipe';
import { AuthGuard } from '@guards/auth.guard';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CreateCategoryDto } from '@dto/create-category.dto';
import { EditCategoryDto } from '@dto/edit-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create')
  createCategory(
    @Body() payload: CreateCategoryDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.categoriesService.createCategory({
      payload,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @Get('all')
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('edit')
  editCategory(@Body() payload: EditCategoryDto, @TrxDecorator() trx: Transaction) {
    return this.categoriesService.editCategory({ payload, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  deleteCategory(
    @Query('categoryId') categoryId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.categoriesService.deleteCategory({ categoryId, trx });
  }
}
