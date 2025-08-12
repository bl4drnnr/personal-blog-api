import { NotFoundException } from '@nestjs/common';

export class FaqNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'FAQ not found') {
    super(message);
    this.message = message;
  }
}
