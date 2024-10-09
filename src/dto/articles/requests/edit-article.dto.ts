import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ImageRegex } from '@regex/image.regex';

export class EditArticleDto {
  @IsUUID('4', { message: ValidationError.WRONG_ARTICLE_ID_FORMAT })
  readonly articleId: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_ARTICLE_NAME_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_ARTICLE_NAME_LENGTH
  })
  readonly articleName?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_ARTICLE_DESC_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_ARTICLE_DESC_LENGTH
  })
  readonly articleDescription?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_ARTICLE_CONTENT_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_ARTICLE_CONTENT_LENGTH
  })
  readonly articleContent?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  readonly articleTags?: Array<string>;

  @IsOptional()
  @Matches(ImageRegex, {
    message: ValidationError.WRONG_IMAGE_FORMAT
  })
  readonly articlePicture?: string;

  @IsOptional()
  @IsUUID('4', { message: ValidationError.WRONG_CATEGORY_ID_FORMAT })
  readonly categoryId?: string;
}
