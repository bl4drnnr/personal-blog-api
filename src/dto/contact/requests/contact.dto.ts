import { IsString, Matches, MinLength } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { ValidationError } from '@interfaces/validation-error.enum';

export class ContactDto {
  @IsString({ message: ValidationError.WRONG_CONTACT_NAME_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_CONTACT_NAME_LENGTH
  })
  name: string;

  @Matches(EmailRegex, {
    message: ValidationError.WRONG_EMAIL_FORMAT
  })
  email: string;

  @IsString({ message: ValidationError.WRONG_CONTACT_MESSAGE_FORMAT })
  @MinLength(1, {
    message: ValidationError.WRONG_CONTACT_MESSAGE_LENGTH
  })
  message: string;
}
