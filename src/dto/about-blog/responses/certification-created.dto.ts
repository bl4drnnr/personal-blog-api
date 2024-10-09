export class CertificationCreatedDto {
  readonly message: string;

  constructor(message = 'certification-created') {
    this.message = message;
  }
}
