import { UnauthorizedException } from '@nestjs/common';

export class BasicAuthUnauthorizedException extends UnauthorizedException {
  readonly message: string;

  constructor(message = 'basic-auth-unauthorized') {
    super(message);
    this.message = message;
  }
}
