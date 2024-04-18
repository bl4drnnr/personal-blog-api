export class QrCodeDto {
  readonly qr: string;
  readonly secret: string;

  constructor({ qr, secret }: { qr: string; secret: string }) {
    this.qr = qr;
    this.secret = secret;
  }
}
