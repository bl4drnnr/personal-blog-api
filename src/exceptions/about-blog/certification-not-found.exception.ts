import { NotFoundException } from '@nestjs/common';

export class CertificationNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'certification-not-found') {
    super(message);
    this.message = message;
  }
}
