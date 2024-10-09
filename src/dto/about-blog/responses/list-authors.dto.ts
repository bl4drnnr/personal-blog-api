import { Author } from '@models/author.model';

export class ListAuthorsDto {
  readonly rows: Array<Author>;
  readonly count: number;

  constructor(rows: Array<Author>, count: number) {
    this.rows = rows;
    this.count = count;
  }
}
