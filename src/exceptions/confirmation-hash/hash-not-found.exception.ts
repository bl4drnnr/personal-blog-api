import { NotFoundException } from '@nestjs/common';

export class HashNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'hash-not-found') {
    super(message);
    this.message = message;
  }
}
