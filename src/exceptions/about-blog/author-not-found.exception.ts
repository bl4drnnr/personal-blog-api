import { NotFoundException } from '@nestjs/common';

export class AuthorNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'author-not-found') {
    super(message);
    this.message = message;
  }
}
