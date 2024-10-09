export class CertificationDeletedDto {
  readonly message: string;

  constructor(message = 'certification-deleted') {
    this.message = message;
  }
}
