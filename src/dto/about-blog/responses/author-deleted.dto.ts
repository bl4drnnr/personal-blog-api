export class AuthorDeletedDto {
  readonly message: string;

  constructor(message = 'author-deleted') {
    this.message = message;
  }
}
