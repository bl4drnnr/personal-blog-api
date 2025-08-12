import { NotFoundException } from '@nestjs/common';

export class MenuPageNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Menu page not found') {
    super(message);
    this.message = message;
  }
}
