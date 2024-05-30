import { BadRequestException } from '@nestjs/common';

export class PreviousPasswordException extends BadRequestException {
  readonly message: string;

  constructor(message = 'previous-password') {
    super(message);
    this.message = message;
  }
}
