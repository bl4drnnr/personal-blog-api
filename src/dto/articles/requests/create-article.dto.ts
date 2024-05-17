import {
  ArrayMinSize,
  IsArray,
  IsString,
  IsUUID,
  Matches,
  MinLength
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ImageRegex } from '@regex/image.regex';

export class CreateArticleDto {
  @IsString({ message: ValidationError.WRONG_ARTICLE_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_ARTICLE_NAME_LENGTH })
  readonly articleName: string;

  @IsString({ message: ValidationError.WRONG_ARTICLE_DESC_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_ARTICLE_DESC_LENGTH })
  readonly articleDescription: string;

  @IsString({ message: ValidationError.WRONG_ARTICLE_CONTENT_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_ARTICLE_CONTENT_LENGTH })
  readonly articleContent: string;

  @IsArray()
  @ArrayMinSize(1)
  readonly articleTags: Array<string>;

  @Matches(ImageRegex, { message: ValidationError.WRONG_IMAGE_FORMAT })
  readonly articlePicture: string;

  @IsUUID('4', { message: ValidationError.WRONG_CATEGORY_ID_FORMAT })
  readonly categoryId: string;
}