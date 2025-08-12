import { NotFoundException } from '@nestjs/common';

export class ContactMessageNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Contact message not found') {
    super(message);
    this.message = message;
  }
}
