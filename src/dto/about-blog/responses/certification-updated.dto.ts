export class CertificationUpdatedDto {
  readonly message: string;

  constructor(message = 'certification-updated') {
    this.message = message;
  }
}
