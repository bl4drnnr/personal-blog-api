import { NotFoundException } from '@nestjs/common';

export class BlogPageNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Blog page content not found') {
    super(message);
    this.message = message;
  }
}
