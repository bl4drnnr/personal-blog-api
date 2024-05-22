export class ArticleEditedDto {
  readonly message: string;

  constructor(message = 'article-edited') {
    this.message = message;
  }
}
