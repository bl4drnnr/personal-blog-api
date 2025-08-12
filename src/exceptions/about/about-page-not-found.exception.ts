import { NotFoundException } from '@nestjs/common';

export class AboutPageNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'About page content not found') {
    super(message);
    this.message = message;
  }
}
