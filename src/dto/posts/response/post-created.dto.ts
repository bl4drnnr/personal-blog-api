export class PostCreatedDto {
  readonly message: string;

  constructor(message = 'post-created') {
    this.message = message;
  }
}
