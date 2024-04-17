import { ForbiddenException } from '@nestjs/common';

export class PasswordChangedException extends ForbiddenException {
  readonly message: string;

  constructor(message = 'password-already-changed') {
    super(message);
    this.message = message;
  }
}
