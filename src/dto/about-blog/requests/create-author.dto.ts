import { IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { ImageRegex } from '@regex/image.regex';
import { ValidationError } from '@interfaces/validation-error.enum';

export class CreateAuthorDto {
  @IsString({
    message: ValidationError.WRONG_AUTHOR_FIRST_NAME_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_AUTHOR_FIRST_NAME_LENGTH
  })
  firstName: string;

  @IsString({
    message: ValidationError.WRONG_AUTHOR_LAST_NAME_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_AUTHOR_LAST_NAME_LENGTH
  })
  lastName: string;

  @IsString({ message: ValidationError.WRONG_ARTICLE_NAME_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_ARTICLE_NAME_LENGTH
  })
  description: string;

  @IsOptional()
  @Matches(ImageRegex, {
    message: ValidationError.WRONG_IMAGE_FORMAT
  })
  profilePicture: string;
}
