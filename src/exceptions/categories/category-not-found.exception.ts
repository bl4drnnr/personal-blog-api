import { NotFoundException } from '@nestjs/common';

export class CategoryNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'category-not-found') {
    super(message);
    this.message = message;
  }
}
