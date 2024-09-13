export class CertificationSelectionStatusUpdatedDto {
  readonly message: string;
  readonly certificationStatus: boolean;

  constructor(
    certificationStatus: boolean,
    message: string = 'certification-status-updated'
  ) {
    this.message = message;
    this.certificationStatus = certificationStatus;
  }
}
