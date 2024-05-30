import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryModel } from '@models/category.model';
import { CreateCategoryInterface } from '@interfaces/create-category.interface';
import { CategoryCreatedDto } from '@dto/category-created.dto';
import { CategoryExistsException } from '@exceptions/category-exists.exception';
import { GetCategoryByNameInterface } from '@interfaces/get-category-by-name.interface';
import { GetCategoryByIdInterface } from '@interfaces/get-category-by-id.interface';
import { CategoryEditedDto } from '@dto/category-edited.dto';
import { EditCategoryInterface } from '@interfaces/edit-category.interface';
import { CategoryNotFoundException } from '@exceptions/category-not-found.exception';
import { DeleteCategoryInterface } from '@interfaces/delete-category.interface';
import { CategoryDeletedDto } from '@dto/category-deleted.dto';
import { CategoryCannotBeDeletedException } from '@exceptions/category-cannot-be-deleted.exception';
import { Language } from '@interfaces/language.enum';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryRepository: typeof CategoryModel
  ) {}

  async createCategory({ payload, trx }: CreateCategoryInterface) {
    const { categories } = payload;

    const ruCategory = categories.find(
      (c) => c.categoryLanguage === Language.RU
    );
    const plCategory = categories.find(
      (c) => c.categoryLanguage === Language.PL
    );
    const enCategory = categories.find(
      (c) => c.categoryLanguage === Language.EN
    );

    const existingRuCategory = await this.getCategoryByName({
      categoryName: ruCategory.categoryName,
      trx
    });

    if (existingRuCategory) throw new CategoryExistsException();

    const existingPlCategory = await this.getCategoryByName({
      categoryName: plCategory.categoryName,
      trx
    });

    if (existingPlCategory) throw new CategoryExistsException();

    const existingEnCategory = await this.getCategoryByName({
      categoryName: enCategory.categoryName,
      trx
    });

    if (existingEnCategory) throw new CategoryExistsException();

    await this.categoryRepository.bulkCreate([...categories], {
      transaction: trx
    });

    return new CategoryCreatedDto();
  }

  async getAllCategories() {
    return this.categoryRepository.findAll();
  }

  async editCategory({ payload, trx }: EditCategoryInterface) {
    const { categoryDescription, categoryName, categoryId } = payload;

    const existingCategory = await this.getCategoryById({ categoryId, trx });

    if (!existingCategory) throw new CategoryNotFoundException();

    await this.categoryRepository.update(
      {
        categoryName,
        categoryDescription
      },
      { where: { id: categoryId }, transaction: trx }
    );

    return new CategoryEditedDto();
  }

  async deleteCategory({ categoryId, trx }: DeleteCategoryInterface) {
    const existingCategory = await this.getCategoryById({ categoryId, trx });

    if (!existingCategory) throw new CategoryNotFoundException();

    if (existingCategory.articles.length > 0)
      throw new CategoryCannotBeDeletedException();

    await this.categoryRepository.destroy({
      where: { id: existingCategory.id },
      transaction: trx
    });

    return new CategoryDeletedDto();
  }

  async getCategoryByName({ categoryName, trx }: GetCategoryByNameInterface) {
    return this.categoryRepository.findOne({
      where: { categoryName },
      include: { all: true },
      transaction: trx
    });
  }

  async getCategoryById({ categoryId, trx }: GetCategoryByIdInterface) {
    return this.categoryRepository.findByPk(categoryId, {
      include: { all: true },
      transaction: trx
    });
  }
}
