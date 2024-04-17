import { ForbiddenException } from '@nestjs/common';

export class AccountNotConfirmedException extends ForbiddenException {
  readonly message: string;

  constructor(message = 'account-not-confirmed') {
    super(message);
    this.message = message;
  }
}
