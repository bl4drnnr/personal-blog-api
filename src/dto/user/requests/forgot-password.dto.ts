import { Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { ValidationError } from '@interfaces/validation-error.enum';

export class ForgotPasswordDto {
  @Matches(EmailRegex, {
    message: ValidationError.WRONG_EMAIL_FORMAT
  })
  readonly email: string;
}
