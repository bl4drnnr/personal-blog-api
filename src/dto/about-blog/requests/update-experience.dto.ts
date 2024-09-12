import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { LinkRegex } from '@regex/link.regex';
import { ImageRegex } from '@regex/image.regex';

export class UpdateExperienceDto {
  @IsUUID('4', { message: ValidationError.WRONG_EXPERIENCE_ID_FORMAT })
  experienceId: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_COMPANY_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_COMPANY_NAME_LENGTH })
  companyName?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_COMPANY_DESC_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_COMPANY_DESC_LENGTH })
  companyDescription?: string;

  @IsOptional()
  @Matches(LinkRegex, { message: ValidationError.WRONG_LINK_FORMAT })
  companyLink?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_COMPANY_LINK_TITLE_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_COMPANY_LINK_TITLE_LENGTH })
  companyLinkTitle?: string;

  @IsOptional()
  @Matches(ImageRegex, { message: ValidationError.WRONG_IMAGE_FORMAT })
  companyPicture?: string;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  startDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  endDate?: Date;
}
