import { IsDateString, IsString, IsUUID, MinLength } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class CreateExperiencePositionDto {
  @IsUUID('4', {
    message: ValidationError.WRONG_EXPERIENCE_ID_FORMAT
  })
  experienceId: string;

  @IsString({ message: ValidationError.WRONG_POSITION_TITLE_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_POSITION_TITLE_LENGTH
  })
  positionTitle: string;

  @IsString({ message: ValidationError.WRONG_POSITION_DESC_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_POSITION_DESC_LENGTH
  })
  positionDescription: string;

  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  positionStartDate: Date;

  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  positionEndDate: Date;
}
