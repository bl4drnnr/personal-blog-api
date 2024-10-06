import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
  ValidateNested
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ImageRegex } from '@regex/image.regex';
import { LinkRegex } from '@regex/link.regex';
import { Type } from 'class-transformer';
import { Language } from '@interfaces/language.enum';

class ExperienceDto {
  @IsString({ message: ValidationError.WRONG_COMPANY_NAME_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_COMPANY_NAME_LENGTH
  })
  readonly companyName: string;

  @IsString({ message: ValidationError.WRONG_COMPANY_DESC_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_COMPANY_DESC_LENGTH
  })
  readonly companyDescription: string;

  @Matches(LinkRegex, { message: ValidationError.WRONG_LINK_FORMAT })
  readonly companyLink: string;

  @IsString({
    message: ValidationError.WRONG_COMPANY_LINK_TITLE_FORMAT
  })
  @MinLength(1, {
    message: ValidationError.WRONG_COMPANY_LINK_TITLE_LENGTH
  })
  readonly companyLinkTitle: string;

  @Matches(ImageRegex, {
    message: ValidationError.WRONG_IMAGE_FORMAT
  })
  readonly companyPicture: string;

  @IsArray()
  @ArrayMinSize(1)
  readonly obtainedSkills: Array<string>;

  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly startDate: Date;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly endDate?: Date;

  @IsEnum(Language)
  readonly experienceLanguage: Language;

  @IsUUID('4', { message: ValidationError.WRONG_AUTHOR_ID_FORMAT })
  readonly authorId: string;
}

export class CreateExperienceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(3, { message: ValidationError.WRONG_EXPERIENCES_LENGTH })
  @ArrayMaxSize(3, { message: ValidationError.WRONG_EXPERIENCES_LENGTH })
  @Type(() => ExperienceDto)
  readonly experiences: Array<ExperienceDto>;
}
