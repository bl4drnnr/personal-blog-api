export class SubscribedToNewslettersDto {
  readonly message: string;

  constructor(message = 'subscribed-to-newsletters') {
    this.message = message;
  }
}
