import { BadRequestException } from '@nestjs/common';

export class WrongRecoveryKeysException extends BadRequestException {
  readonly message: string;

  constructor(message = 'wrong-recovery-keys') {
    super(message);
    this.message = message;
  }
}
