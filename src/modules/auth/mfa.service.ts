import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

const ISSUER = 'Personal Blog Admin';

@Injectable()
export class MfaService {
  constructor() {
    // Accept one time-step of clock drift, mirroring the legacy speakeasy setup.
    authenticator.options = { window: 1 };
  }

  generateSecret(): string {
    return authenticator.generateSecret();
  }

  /**
   * The secret is returned in the clear alongside the QR. That is not an extra
   * exposure — the QR image and the otpauth URL both already carry it verbatim,
   * and the caller is holding an mfa-setup token for this very account. Password
   * managers take the key as text, so without this they have to OCR their own QR.
   */
  async buildEnrollment(
    email: string,
    secret: string,
  ): Promise<{ secret: string; otpauthUrl: string; qrDataUrl: string }> {
    const otpauthUrl = authenticator.keyuri(email, ISSUER, secret);
    return { secret, otpauthUrl, qrDataUrl: await toDataURL(otpauthUrl) };
  }

  verify(code: string, secret: string): boolean {
    return authenticator.verify({ token: code, secret });
  }
}
