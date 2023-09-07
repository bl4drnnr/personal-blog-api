import * as node2fa from 'node-2fa';
import { HttpException, Injectable } from '@nestjs/common';
import { Confirmation } from '@enums/confirmation-type.enum';
import { UsersService } from '@users/users.service';
import { ConfirmationHashService } from '@confirmation-hash/confirmation-hash.service';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { RegistrationGenerate2faInterface } from '@interfaces/registration-generate-2fa.interface';
import { LoginGenerate2faInterface } from '@interfaces/login-generate-2fa.interface';
import { RegistrationVerify2faInterface } from '@interfaces/registration-verify-2fa.interface';
import { LoginVerify2faInterface } from '@interfaces/login-verify-2fa.interface';
import { GenerateQrCodeInterface } from '@interfaces/generate-qr-code.interface';
import { VerifyQrCodeInterface } from '@interfaces/verify-qr-code.interface';
import { QrCodeDto } from '@dto/qr-code.dto';
import { MfaSetDto } from '@dto/mfa-set.dto';

@Injectable()
export class SecurityService {
  constructor(
    private readonly usersService: UsersService,
    private readonly confirmationHashService: ConfirmationHashService
  ) {}

  async registrationGenerateTwoFaQrCode({
    confirmationHash,
    trx
  }: RegistrationGenerate2faInterface) {
    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        trx
      });

    const { email } = await this.usersService.getUserById({ id: userId, trx });

    return await this.generateQrCode({ email });
  }

  async loginGenerateTwoFaQrCode({ payload, trx }: LoginGenerate2faInterface) {
    const { email, password } = payload;

    await this.usersService.verifyUserCredentials({
      email,
      password,
      trx
    });

    return await this.generateQrCode({ email });
  }

  async registrationVerifyTwoFaQrCode({
    payload,
    confirmationHash,
    trx
  }: RegistrationVerify2faInterface) {
    const { code, twoFaToken } = payload;

    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
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

  private async generateQrCode({ email }: GenerateQrCodeInterface) {
    const { qr, secret } = node2fa.generateSecret({
      name: 'Mikhail Bahdashcyh Blog',
      account: email
    });

    return new QrCodeDto({
      qr,
      secret
    });
  }

  private async verifyQrCode({
    userId,
    code,
    twoFaToken,
    trx
  }: VerifyQrCodeInterface) {
    const delta = node2fa.verifyToken(twoFaToken, code);

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
