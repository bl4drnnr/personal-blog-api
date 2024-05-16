import { BadRequestException } from '@nestjs/common';

export class CategoryExistsException extends BadRequestException {
  readonly message: string;

  constructor(message = 'category-already-exists') {
    super(message);
    this.message = message;
  }
}
