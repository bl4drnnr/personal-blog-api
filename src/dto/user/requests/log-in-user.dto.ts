import { IsOptional, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { MfaCodeRegex } from '@regex/mfa-code.regex';

export class LogInUserDto {
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @Matches(PasswordRegex, {
    message: ValidationError.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;

  @IsOptional()
  @Matches(MfaCodeRegex, {
    message: ValidationError.WRONG_PHONE_CODE_FORMAT
  })
  readonly mfaCode?: string;
}

export class LogInUserResponseDto {
  readonly _at: string;
  readonly _rt: string;

  constructor({ _at, _rt }: { _at: string; _rt: string }) {
    this._at = _at;
    this._rt = _rt;
  }
}
