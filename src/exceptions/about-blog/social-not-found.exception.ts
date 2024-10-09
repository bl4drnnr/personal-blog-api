import { NotFoundException } from '@nestjs/common';

export class SocialNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'social-not-found') {
    super(message);
    this.message = message;
  }
}
