import { NotFoundException } from '@nestjs/common';

export class NotFoundPageNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Not found page content not found') {
    super(message);
    this.message = message;
  }
}
