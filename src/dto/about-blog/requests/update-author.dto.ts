import {
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ImageRegex } from '@regex/image.regex';

export class UpdateAuthorDto {
  @IsUUID('4', { message: ValidationError.WRONG_AUTHOR_ID_FORMAT })
  authorId: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_AUTHOR_FIRST_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_AUTHOR_FIRST_NAME_LENGTH })
  firstName?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_AUTHOR_LAST_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_AUTHOR_LAST_NAME_LENGTH })
  lastName?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_ARTICLE_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_ARTICLE_NAME_LENGTH })
  description?: string;

  @IsOptional()
  @Matches(ImageRegex, { message: ValidationError.WRONG_IMAGE_FORMAT })
  profilePicture?: string;
}
