import {
  IsOptional,
  IsString,
  IsUUID,
  MinLength
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

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
  @IsString({
    message: ValidationError.WRONG_SOCIAL_LINK_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_SOCIAL_LINK_LENGTH
  })
  link?: string;
}
