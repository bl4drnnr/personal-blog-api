import { BadRequestException } from '@nestjs/common';

export class WrongPictureException extends BadRequestException {
  readonly message: string;

  constructor(message = 'wrong-picture-format') {
    super(message);
    this.message = message;
  }
}
