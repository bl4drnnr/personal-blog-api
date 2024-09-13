export class CertificationCreatedDto {
  readonly certificationId: string;

  constructor(certificationId: string) {
    this.certificationId = certificationId;
  }
}
