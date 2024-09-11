import { NotFoundException } from '@nestjs/common';

export class NewslettersNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'newsletters-not-found') {
    super(message);
    this.message = message;
  }
}
