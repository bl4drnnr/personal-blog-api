import { BadRequestException } from '@nestjs/common';

export class WrongCodeException extends BadRequestException {
  readonly message: string;

  constructor(message = 'wrong-code') {
    super(message);
    this.message = message;
  }
}
