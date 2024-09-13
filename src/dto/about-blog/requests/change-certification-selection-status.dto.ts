import { IsUUID } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class ChangeCertificationSelectionStatusDto {
  @IsUUID('4', { message: ValidationError.WRONG_CERTIFICATION_ID_FORMAT })
  certificationId: string;
}
