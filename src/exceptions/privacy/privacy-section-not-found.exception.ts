import { NotFoundException } from '@nestjs/common';

export class PrivacySectionNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Privacy section not found') {
    super(message);
    this.message = message;
  }
}
