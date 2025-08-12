import { NotFoundException } from '@nestjs/common';

export class ProjectPageNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Projects page content not found') {
    super(message);
    this.message = message;
  }
}
