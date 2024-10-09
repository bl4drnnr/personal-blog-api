import { Cert } from '@models/cert.model';

export class ListCertificationsDto {
  readonly rows: Array<Cert>;
  readonly count: number;

  constructor(rows: Array<Cert>, count: number) {
    this.rows = rows;
    this.count = count;
  }
}
