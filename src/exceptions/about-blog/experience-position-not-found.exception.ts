import { NotFoundException } from '@nestjs/common';

export class ExperiencePositionNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'experience-position-not-found') {
    super(message);
    this.message = message;
  }
}
