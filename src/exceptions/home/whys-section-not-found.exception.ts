import { NotFoundException } from '@nestjs/common';

export class WhysSectionNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Whys section not found') {
    super(message);
    this.message = message;
  }
}
