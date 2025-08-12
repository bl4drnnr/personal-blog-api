import { NotFoundException } from '@nestjs/common';

export class LicenseContentNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'License page content not found') {
    super(message);
    this.message = message;
  }
}
