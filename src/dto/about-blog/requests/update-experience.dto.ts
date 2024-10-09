import {
  ArrayMinSize,
  IsArray,
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
  @IsUUID('4', {
    message: ValidationError.WRONG_EXPERIENCE_ID_FORMAT
  })
  readonly experienceId: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_COMPANY_NAME_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_COMPANY_NAME_LENGTH
  })
  readonly companyName?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_COMPANY_DESC_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_COMPANY_DESC_LENGTH
  })
  readonly companyDescription?: string;

  @IsOptional()
  @Matches(LinkRegex, { message: ValidationError.WRONG_LINK_FORMAT })
  readonly companyLink?: string;

  @IsOptional()
  @IsString({
    message: ValidationError.WRONG_COMPANY_LINK_TITLE_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_COMPANY_LINK_TITLE_LENGTH
  })
  readonly companyLinkTitle?: string;

  @IsOptional()
  @Matches(ImageRegex, {
    message: ValidationError.WRONG_IMAGE_FORMAT
  })
  readonly companyPicture?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  readonly obtainedSkills?: Array<string>;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly startDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly endDate?: Date;

  @IsOptional()
  @IsUUID('4', { message: ValidationError.WRONG_AUTHOR_ID_FORMAT })
  readonly authorId?: string;
}
