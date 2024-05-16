import { ArrayMinSize, IsArray, IsString, MinLength } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class CreateArticleDto {
  @IsString({ message: ValidationError.WRONG_POST_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_POST_NAME_LENGTH })
  readonly articleName: string;

  @IsString({ message: ValidationError.WRONG_POST_DESC_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_POST_DESC_LENGTH })
  readonly articleDescription: string;

  @IsArray()
  @ArrayMinSize(1)
  readonly articleTags: Array<string>;
}
