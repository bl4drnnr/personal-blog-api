import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MinLength
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class UpdateExperiencePositionDto {
  @IsUUID('4', {
    message: ValidationError.WRONG_EXPERIENCE_POSITION_ID_FORMAT
  })
  readonly experiencePositionId: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_POSITION_TITLE_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_POSITION_TITLE_LENGTH
  })
  readonly positionTitle?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_POSITION_DESC_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_POSITION_DESC_LENGTH
  })
  readonly positionDescription?: string;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly positionStartDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly positionEndDate?: Date;
}
