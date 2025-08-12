import { NotFoundException } from '@nestjs/common';

export class LicenseTileNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'License tile not found') {
    super(message);
    this.message = message;
  }
}
