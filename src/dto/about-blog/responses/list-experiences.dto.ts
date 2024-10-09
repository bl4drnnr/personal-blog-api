import { Experience } from '@models/experience.model';

export class ListExperiencesDto {
  readonly rows: Array<Experience>;
  readonly count: number;

  constructor(rows: Array<Experience>, count: number) {
    this.rows = rows;
    this.count = count;
  }
}
