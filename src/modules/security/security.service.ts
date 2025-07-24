import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { HttpException, Injectable } from '@nestjs/common';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { UsersService } from '@modules/users.service';
import { LoginGenerate2faInterface } from '@interfaces/login-generate-2fa.interface';
import { Generate2faInterface } from '@interfaces/generate-2fa.interface';
import { LoginVerify2faInterface } from '@interfaces/login-verify-2fa.interface';
import { Verify2faInterface } from '@interfaces/verify-2fa.interface';
import { GenerateQrCodeInterface } from '@interfaces/generate-qr-code.interface';
import { VerifyQrCodeInterface } from '@interfaces/verify-qr-code.interface';
import { QrCodeDto } from '@dto/qr-code.dto';
import { MfaSetDto } from '@dto/mfa-set.dto';

@Injectable()
export class SecurityService {
  constructor(private readonly usersService: UsersService) {}

  async loginGenerateTwoFaQrCode({ payload, trx }: LoginGenerate2faInterface) {
    const { email, password } = payload;

    await this.usersService.verifyUserCredentials({
      email,
      password,
      trx
    });

    return await this.generateQrCode({ email });
  }

  async generateTwoFaQrCode({ userId, trx }: Generate2faInterface) {
    const { email } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    return await this.generateQrCode({ email });
  }

  async loginVerifyTwoFaQrCode({ payload, trx }: LoginVerify2faInterface) {
    const { code, twoFaToken, email, password } = payload;

    const { id: userId } = await this.usersService.verifyUserCredentials({
      email,
      password,
      trx
    });

    try {
      return await this.verifyQrCode({
        userId,
        code,
        twoFaToken,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async verifyTwoFaQrCode({ payload, userId, trx }: Verify2faInterface) {
    const { code, twoFaToken } = payload;

    try {
      return await this.verifyQrCode({
        userId,
        code,
        twoFaToken,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  private async generateQrCode({ email }: GenerateQrCodeInterface) {
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `Personal Blog - ${email}`
    });

    const qrUrl = await qrcode.toDataURL(secret.otpauth_url);

    return new QrCodeDto({
      qr: qrUrl,
      secret: secret.base32
    });
  }

  private async verifyQrCode({
    userId,
    code,
    twoFaToken,
    trx
  }: VerifyQrCodeInterface) {
    const delta = speakeasy.totp.verifyDelta({
      secret: twoFaToken,
      encoding: 'base32',
      token: code
    });

    if (!delta || (delta && delta.delta !== 0)) throw new WrongCodeException();

    await this.usersService.updateUser({
      payload: { isMfaSet: true },
      userId,
      trx
    });

    await this.usersService.updateUserSettings({
      payload: { twoFaToken },
      userId,
      trx
    });

    return new MfaSetDto();
  }
}
