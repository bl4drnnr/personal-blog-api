import { IsString, IsUUID, MinLength } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class CreateSocialDto {
  @IsUUID('4', { message: ValidationError.WRONG_AUTHOR_ID_FORMAT })
  authorId: string;

  @IsString({
    message: ValidationError.WRONG_SOCIAL_TITLE_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_SOCIAL_TITLE_LENGTH
  })
  title: string;

  @IsString({
    message: ValidationError.WRONG_SOCIAL_LINK_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_SOCIAL_LINK_LENGTH
  })
  link: string;
}
