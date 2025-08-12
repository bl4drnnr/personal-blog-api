import { NotFoundException } from '@nestjs/common';

export class PrivacyPageContentNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Privacy page content not found') {
    super(message);
    this.message = message;
  }
}
