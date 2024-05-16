import { forwardRef, Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryModel } from '@models/category.model';
import { AuthModule } from '@modules/auth.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([CategoryModel])
  ],
  exports: [CategoriesService]
})
export class CategoriesModule {}
