import { BadRequestException } from '@nestjs/common';

export class ParseException extends BadRequestException {
  readonly message: string;

  constructor(message = 'parse-error') {
    super(message);
    this.message = message;
  }
}
