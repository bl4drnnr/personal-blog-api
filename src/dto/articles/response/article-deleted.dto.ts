export class ArticleDeletedDto {
  readonly message: string;

  constructor(message = 'article-deleted') {
    this.message = message;
  }
}
