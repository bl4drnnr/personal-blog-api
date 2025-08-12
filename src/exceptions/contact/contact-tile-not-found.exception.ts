import { NotFoundException } from '@nestjs/common';

export class ContactTileNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Contact tile not found') {
    super(message);
    this.message = message;
  }
}
