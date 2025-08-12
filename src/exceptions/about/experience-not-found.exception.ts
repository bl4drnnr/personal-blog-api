import { NotFoundException } from '@nestjs/common';

export class ExperienceNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Experience not found') {
    super(message);
    this.message = message;
  }
}
