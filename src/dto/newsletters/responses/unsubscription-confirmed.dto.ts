export class UnsubscriptionConfirmedDto {
  readonly message: string;

  constructor(message = 'unsubscription-confirmed') {
    this.message = message;
  }
}
