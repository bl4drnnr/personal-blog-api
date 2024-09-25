import { IsOptional, IsString, IsUUID, Matches, MinLength } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { LinkRegex } from '@regex/link.regex';

export class UpdateSocialDto {
  @IsUUID('4', { message: ValidationError.WRONG_SOCIAL_ID_FORMAT })
  socialId: string;

  @IsOptional()
  @IsString({
    message: ValidationError.WRONG_SOCIAL_TITLE_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_SOCIAL_TITLE_LENGTH
  })
  title?: string;

  @IsOptional()
  @Matches(LinkRegex, { message: ValidationError.WRONG_LINK_FORMAT })
  link?: string;
}
