import { BadRequestException } from '@nestjs/common';

export class WrongCredentialsException extends BadRequestException {
  readonly message: string;

  constructor(message = 'wrong-credentials') {
    super(message);
    this.message = message;
  }
}
