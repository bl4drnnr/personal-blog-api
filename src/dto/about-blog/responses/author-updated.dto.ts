export class AuthorUpdatedDto {
  readonly message: string;

  constructor(message = 'author-updated') {
    this.message = message;
  }
}
