import { BadRequestException } from '@nestjs/common';

export class SubscriptionAlreadyConfirmedException extends BadRequestException {
  readonly message: string;

  constructor(message = 'subscription-already-confirmed') {
    super(message);
    this.message = message;
  }
}
