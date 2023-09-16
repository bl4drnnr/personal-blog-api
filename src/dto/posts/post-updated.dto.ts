export class PostUpdatedDto {
  readonly message: string;

  constructor(message = 'post-update') {
    this.message = message;
  }
}
