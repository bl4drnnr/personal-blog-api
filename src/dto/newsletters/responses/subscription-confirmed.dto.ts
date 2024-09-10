export class SubscriptionConfirmedDto {
  readonly message: string;

  constructor(message = 'subscription-confirmed') {
    this.message = message;
  }
}
