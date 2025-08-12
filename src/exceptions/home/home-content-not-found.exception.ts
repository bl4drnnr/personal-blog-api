import { NotFoundException } from '@nestjs/common';

export class HomeContentNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Home page content not found') {
    super(message);
    this.message = message;
  }
}
