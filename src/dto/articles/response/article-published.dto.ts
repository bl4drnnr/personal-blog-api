export class ArticlePublishStatusDto {
  readonly message: string;

  constructor(message = 'article-publish-status-changed') {
    this.message = message;
  }
}
