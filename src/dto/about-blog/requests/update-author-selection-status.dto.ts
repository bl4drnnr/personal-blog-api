import { IsUUID } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class UpdateAuthorSelectionStatusDto {
  @IsUUID('4', { message: ValidationError.WRONG_AUTHOR_ID_FORMAT })
  authorId: string;
}
