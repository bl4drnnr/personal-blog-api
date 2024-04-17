import { BadRequestException } from '@nestjs/common';

export class CorruptedTokenException extends BadRequestException {
  readonly message: string;

  constructor(message = 'corrupted-token') {
    super(message);
    this.message = message;
  }
}
