import { IsString, IsUUID, Matches, MinLength } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { LinkRegex } from '@regex/link.regex';

export class CreateSocialDto {
  @IsUUID('4', { message: ValidationError.WRONG_AUTHOR_ID_FORMAT })
  readonly authorId: string;

  @IsString({
    message: ValidationError.WRONG_SOCIAL_TITLE_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_SOCIAL_TITLE_LENGTH
  })
  readonly title: string;

  @Matches(LinkRegex, { message: ValidationError.WRONG_LINK_FORMAT })
  readonly link: string;
}
