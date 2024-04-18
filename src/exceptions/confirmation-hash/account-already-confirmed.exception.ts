import { ForbiddenException } from '@nestjs/common';

export class AccountAlreadyConfirmedException extends ForbiddenException {
  readonly message: string;

  constructor(message = 'account-already-confirmed') {
    super(message);
    this.message = message;
  }
}
