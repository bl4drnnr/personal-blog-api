import { UnauthorizedException } from '@nestjs/common';

export class WrongAuthToken extends UnauthorizedException {
  constructor() {
    super('wrong-auth-token');
  }
}
