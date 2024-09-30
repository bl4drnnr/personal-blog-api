import { IsUUID } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class ChangeExperienceSelectionStatusDto {
  @IsUUID('4', {
    message: ValidationError.WRONG_EXPERIENCE_ID_FORMAT
  })
  readonly experienceId: string;
}
