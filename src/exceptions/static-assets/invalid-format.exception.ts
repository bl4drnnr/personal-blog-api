import { BadRequestException } from '@nestjs/common';

export class InvalidFormatException extends BadRequestException {
  readonly message: string;

  constructor(
    message = 'Invalid image format. Only PNG, JPG, JPEG, and SVG are allowed.'
  ) {
    super(message);
    this.message = message;
  }
}
