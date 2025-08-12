import { ServiceUnavailableException } from '@nestjs/common';

export class PasswordProtectionDisabledException extends ServiceUnavailableException {
  readonly message: string;

  constructor(message = 'password-protection-disabled') {
    super(message);
    this.message = message;
  }
}
