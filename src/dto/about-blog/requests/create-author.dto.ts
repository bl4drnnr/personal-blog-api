import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray, IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested
} from 'class-validator';
import { ImageRegex } from '@regex/image.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { Type } from 'class-transformer';
import { Language } from '@interfaces/language.enum';

class AuthorDto {
  @IsString({
    message: ValidationError.WRONG_AUTHOR_FIRST_NAME_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_AUTHOR_FIRST_NAME_LENGTH
  })
  readonly firstName: string;

  @IsString({
    message: ValidationError.WRONG_AUTHOR_LAST_NAME_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_AUTHOR_LAST_NAME_LENGTH
  })
  readonly lastName: string;

  @IsString({
    message: ValidationError.WRONG_AUTHOR_TITLE_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_AUTHOR_TITLE_LENGTH
  })
  readonly title: string;

  @IsString({ message: ValidationError.WRONG_ARTICLE_NAME_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_ARTICLE_NAME_LENGTH
  })
  readonly description: string;

  @IsOptional()
  @Matches(ImageRegex, {
    message: ValidationError.WRONG_IMAGE_FORMAT
  })
  readonly profilePicture: string;

  @IsEnum(Language)
  readonly authorLanguage: Language;
}

export class CreateAuthorDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(3, { message: ValidationError.WRONG_AUTHORS_LENGTH })
  @ArrayMaxSize(3, { message: ValidationError.WRONG_AUTHORS_LENGTH })
  @Type(() => AuthorDto)
  readonly authors: Array<AuthorDto>;
}
