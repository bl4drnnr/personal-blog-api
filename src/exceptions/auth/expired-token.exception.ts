import { UnauthorizedException } from '@nestjs/common';

export class ExpiredTokenException extends UnauthorizedException {
  readonly message: string;

  constructor(message = 'token-expired') {
    super(message);
    this.message = message;
  }
}
