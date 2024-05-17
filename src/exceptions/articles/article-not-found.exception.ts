import { NotFoundException } from '@nestjs/common';

export class ArticleNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'article-not-found') {
    super(message);
    this.message = message;
  }
}
