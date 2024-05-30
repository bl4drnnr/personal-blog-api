import { NotFoundException } from '@nestjs/common';

export class LinkExpiredException extends NotFoundException {
  readonly message: string;

  constructor(message = 'link-expired') {
    super(message);
    this.message = message;
  }
}
