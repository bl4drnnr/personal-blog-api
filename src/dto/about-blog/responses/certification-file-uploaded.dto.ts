export class CertificationFileUploadedDto {
  readonly certificationFileName: string;
  readonly message: string;

  constructor(
    certificationFileName: string,
    message = 'certification-file-uploaded'
  ) {
    this.certificationFileName = certificationFileName;
    this.message = message;
  }
}
