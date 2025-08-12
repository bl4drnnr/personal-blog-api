import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'User not found') {
    super(message);
    this.message = message;
  }
}
