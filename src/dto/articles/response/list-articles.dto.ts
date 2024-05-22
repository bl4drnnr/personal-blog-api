import { ArticleModel } from '@models/article.model';

export class ListArticlesDto {
  readonly rows: Array<ArticleModel>;
  readonly count: number;

  constructor(rows: Array<ArticleModel>, count: number) {
    this.rows = rows;
    this.count = count;
  }
}
