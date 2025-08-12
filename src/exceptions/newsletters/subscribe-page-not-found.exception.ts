import { NotFoundException } from '@nestjs/common';

export class SubscribePageNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Subscribe page not found') {
    super(message);
    this.message = message;
  }
}
