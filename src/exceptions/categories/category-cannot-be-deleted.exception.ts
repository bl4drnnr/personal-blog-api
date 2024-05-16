import { BadRequestException } from '@nestjs/common';

export class CategoryCannotBeDeletedException extends BadRequestException {
  readonly message: string;

  constructor(message = 'category-cannot-be-deleted') {
    super(message);
    this.message = message;
  }
}
