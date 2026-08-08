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

  async buildEnrollment(
    email: string,
    secret: string,
  ): Promise<{ otpauthUrl: string; qrDataUrl: string }> {
    const otpauthUrl = authenticator.keyuri(email, ISSUER, secret);
    return { otpauthUrl, qrDataUrl: await toDataURL(otpauthUrl) };
  }

  verify(code: string, secret: string): boolean {
    return authenticator.verify({ token: code, secret });
  }
}
