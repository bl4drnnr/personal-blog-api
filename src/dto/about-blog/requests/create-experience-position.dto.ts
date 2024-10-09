import { IsDateString, IsEnum, IsString, IsUUID, MinLength } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { Language } from '@interfaces/language.enum';

export class CreateExperiencePositionDto {
  @IsUUID('4', {
    message: ValidationError.WRONG_EXPERIENCE_ID_FORMAT
  })
  readonly experienceId: string;

  @IsString({ message: ValidationError.WRONG_POSITION_TITLE_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_POSITION_TITLE_LENGTH
  })
  readonly positionTitle: string;

  @IsString({ message: ValidationError.WRONG_POSITION_DESC_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_POSITION_DESC_LENGTH
  })
  readonly positionDescription: string;

  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly positionStartDate: Date;

  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly positionEndDate: Date;

  @IsEnum(Language, { message: ValidationError.WRONG_LANGUAGES_FORMAT })
  readonly positionLanguage: Language;
}
