import { ServiceUnavailableException } from '@nestjs/common';

export class MisconfigurationException extends ServiceUnavailableException {
  readonly message: string;

  constructor(
    message = 'Missing deployment configuration. Please check environment variables.'
  ) {
    super(message);
    this.message = message;
  }
}
