import { BadRequestException } from '@nestjs/common';

export class ExperienceNotFoundException extends BadRequestException {
  readonly message: string;

  constructor(message = 'Menu page already exists. Use update instead.') {
    super(message);
    this.message = message;
  }
}
