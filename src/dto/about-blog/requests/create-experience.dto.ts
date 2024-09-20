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
import { ImageRegex } from '@regex/image.regex';
import { LinkRegex } from '@regex/link.regex';

export class CreateExperienceDto {
  @IsString({ message: ValidationError.WRONG_COMPANY_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_COMPANY_NAME_LENGTH })
  companyName: string;

  @IsString({ message: ValidationError.WRONG_COMPANY_DESC_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_COMPANY_DESC_LENGTH })
  companyDescription: string;

  @Matches(LinkRegex, { message: ValidationError.WRONG_LINK_FORMAT })
  companyLink: string;

  @IsString({ message: ValidationError.WRONG_COMPANY_LINK_TITLE_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_COMPANY_LINK_TITLE_LENGTH })
  companyLinkTitle: string;

  @Matches(ImageRegex, { message: ValidationError.WRONG_IMAGE_FORMAT })
  companyPicture: string;

  @IsArray()
  @ArrayMinSize(1)
  obtainedSkills: Array<string>;

  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  startDate: Date;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  endDate?: Date;

  @IsUUID('4', { message: ValidationError.WRONG_AUTHOR_ID_FORMAT })
  authorId: string;
}
