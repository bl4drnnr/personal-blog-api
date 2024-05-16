export class ArticleCreatedDto {
  readonly message: string;

  constructor(message = 'article-created') {
    this.message = message;
  }
}
