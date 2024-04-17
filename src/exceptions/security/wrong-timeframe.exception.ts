import { BadRequestException } from '@nestjs/common';

export class WrongTimeframeException extends BadRequestException {
  readonly message: string;

  constructor(message = 'wrong-timeframe') {
    super(message);
    this.message = message;
  }
}
