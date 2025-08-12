import { BadRequestException } from '@nestjs/common';

export class InvalidFormatException extends BadRequestException {
  readonly message: string;

  constructor(message = 'Invalid base64 file format') {
    super(message);
    this.message = message;
  }
}
