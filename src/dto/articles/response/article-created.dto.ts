export class ArticleCreatedDto {
  readonly link: string;
  readonly message: string;

  constructor(link: string, message = 'article-created') {
    this.link = link;
    this.message = message;
  }
}
