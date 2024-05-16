import { IsString, MinLength } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class CreateCategoryDto {
  @IsString({ message: ValidationError.WRONG_CATEGORY_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_CATEGORY_NAME_LENGTH })
  readonly categoryName: string;

  @IsString({ message: ValidationError.WRONG_CATEGORY_DESC_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_CATEGORY_DESC_LENGTH })
  readonly categoryDescription: string;
}
