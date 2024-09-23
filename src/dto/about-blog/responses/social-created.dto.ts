export class SocialCreatedDto {
  readonly message: string;

  constructor(message = 'social-created') {
    this.message = message;
  }
}
