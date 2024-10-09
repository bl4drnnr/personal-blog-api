export class SocialDeletedDto {
  readonly message: string;

  constructor(message = 'social-deleted') {
    this.message = message;
  }
}
