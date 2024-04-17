import { BadRequestException } from '@nestjs/common';

export class InvalidTokenException extends BadRequestException {
  readonly message: string;

  constructor(message = 'invalid-token') {
    super(message);
    this.message = message;
  }
}
