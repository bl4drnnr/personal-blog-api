import { NotFoundException } from '@nestjs/common';

export class ContactPageNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Contact page not found') {
    super(message);
    this.message = message;
  }
}
