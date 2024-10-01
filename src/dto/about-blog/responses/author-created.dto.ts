export class AuthorCreatedDto {
  readonly message: string;

  constructor(message = 'author-created') {
    this.message = message;
  }
}
