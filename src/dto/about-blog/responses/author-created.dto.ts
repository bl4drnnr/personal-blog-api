export class AuthorCreatedDto {
  readonly authorId: string;

  constructor(authorId: string) {
    this.authorId = authorId;
  }
}
