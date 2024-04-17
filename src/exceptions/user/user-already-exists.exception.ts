import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsException extends ConflictException {
  readonly message: string;

  constructor(message = 'user-already-exists') {
    super(message);
    this.message = message;
  }
}
