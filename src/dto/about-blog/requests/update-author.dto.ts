import { IsOptional, IsString, IsUUID, Matches, MinLength } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ImageRegex } from '@regex/image.regex';

export class UpdateAuthorDto {
  @IsUUID('4', { message: ValidationError.WRONG_AUTHOR_ID_FORMAT })
  readonly authorId: string;

  @IsOptional()
  @IsString({
    message: ValidationError.WRONG_AUTHOR_FIRST_NAME_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_AUTHOR_FIRST_NAME_LENGTH
  })
  readonly firstName?: string;

  @IsOptional()
  @IsString({
    message: ValidationError.WRONG_AUTHOR_LAST_NAME_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_AUTHOR_LAST_NAME_LENGTH
  })
  readonly lastName?: string;

  @IsOptional()
  @IsString({
    message: ValidationError.WRONG_AUTHOR_TITLE_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_AUTHOR_TITLE_LENGTH
  })
  readonly title?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_ARTICLE_NAME_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_ARTICLE_NAME_LENGTH
  })
  readonly description?: string;

  @IsOptional()
  @Matches(ImageRegex, {
    message: ValidationError.WRONG_IMAGE_FORMAT
  })
  readonly profilePicture?: string;
}
