export class AuthorCreatedDto {
  readonly authorsIds: Array<string>;
  readonly message: string;

  constructor(authorsIds: Array<string>, message = 'author-created') {
    this.authorsIds = authorsIds;
    this.message = message;
  }
}
