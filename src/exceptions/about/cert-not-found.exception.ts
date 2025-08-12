import { NotFoundException } from '@nestjs/common';

export class CertNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Certificate not found') {
    super(message);
    this.message = message;
  }
}
