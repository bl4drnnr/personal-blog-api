import { ForbiddenException } from '@nestjs/common';

export class TacNotAcceptedException extends ForbiddenException {
  readonly message: string;

  constructor(message = 'tac-not-accepted') {
    super(message);
    this.message = message;
  }
}
