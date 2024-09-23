export class SocialUpdatedDto {
  readonly message: string;

  constructor(message = 'social-updated') {
    this.message = message;
  }
}
