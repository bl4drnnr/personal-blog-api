import * as speakeasy from 'speakeasy';
import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';
import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { Session } from '@models/session.model';
import { InjectModel } from '@nestjs/sequelize';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { LogInUserResponseDto } from '@dto/log-in-user.dto';
import { JwtService } from '@nestjs/jwt';
import { CryptographicService } from '@shared/cryptographic.service';
import { ApiConfigService } from '@shared/config.service';
import { UsersService } from '@modules/users.service';
import { EmailService } from '@shared/email.service';
import { LoginInterface } from '@interfaces/login.interface';
import { AccountNotConfirmedException } from '@exceptions/account-not-confirmed.exception';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { GenerateTokensInterface } from '@interfaces/generate-tokens.interface';
import { RegistrationInterface } from '@interfaces/registration.interface';
import { UserAlreadyExistsException } from '@exceptions/user-already-exists.exception';
import { TacNotAcceptedException } from '@exceptions/tac-not-accepted.exception';
import { UserCreatedDto } from '@dto/user-created.dto';
import { LogoutInterface } from '@interfaces/logout.interface';
import { CorruptedTokenException } from '@exceptions/corrupted-token.exception';
import { LoggedOutDto } from '@dto/logged-out.dto';
import { InvalidTokenException } from '@exceptions/invalid-token.exception';
import { RefreshTokenInterface } from '@interfaces/refresh-token.interface';
import { CheckMfaStatusInterface } from '@interfaces/check-mfa-status.interface';
import { ExpiredTokenException } from '@exceptions/expired-token.exception';
import { TokenTwoFaRequiredDto } from '@dto/token-two-fa-required.dto';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { VerifyTokenInterface } from '@interfaces/verify-token.interface';
import { GenerateAccessTokenInterface } from '@interfaces/generate-access-token.interface';
import { UpdateRefreshTokenInterface } from '@interfaces/update-refresh-token.interface';
import { GetTokenInterface } from '@interfaces/get-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectModel(Session)
    private readonly sessionRepository: typeof Session
  ) {}

  async login({ payload, trx }: LoginInterface) {
    const { email, password, mfaCode } = payload;

    const {
      id: userId,
      confirmationHashes,
      isMfaSet,
      userSettings
    } = await this.usersService.verifyUserCredentials({
      email,
      password,
      trx
    });

    const registrationHashes = [Confirmation.REGISTRATION];

    const registrationHash = confirmationHashes.find((hash) =>
      registrationHashes.includes(hash.confirmationType)
    );

    const isAccConfirmed = registrationHash.confirmed;
    const isRecoverySetUp = userSettings.recoveryKeysFingerprint;

    if (!isAccConfirmed) throw new AccountNotConfirmedException();

    if (!isMfaSet) return new MfaNotSetDto();

    if (!isRecoverySetUp) return new RecoveryKeysNotSetDto();

    try {
      const mfaStatusResponse = await this.checkUserMfaStatus({
        mfaCode,
        userSettings
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    const generateTokensPayload: GenerateTokensInterface = {
      userId,
      trx
    };

    const { _rt, _at } = await this.generateTokens(generateTokensPayload);

    return new LogInUserResponseDto({ _rt, _at });
  }

  async registration({ payload, trx }: RegistrationInterface) {
    const { email, password, firstName, lastName, tac } = payload;

    const existingUser = await this.usersService.getUserByEmail({
      email,
      trx
    });

    if (existingUser) throw new UserAlreadyExistsException();
    if (!tac) throw new TacNotAcceptedException();

    const hashedPassword = await this.cryptographicService.hashPassword({
      password
    });

    const { id: userId } = await this.usersService.createUser({
      payload: {
        ...payload,
        password: hashedPassword
      },
      trx
    });

    await this.emailService.sendRegistrationConfirmationEmail({
      payload: {
        to: email,
        confirmationType: Confirmation.REGISTRATION,
        userId
      },
      userInfo: {
        firstName,
        lastName
      },
      trx
    });

    return new UserCreatedDto();
  }

  async logout({ userId, trx }: LogoutInterface) {
    await this.sessionRepository.destroy({
      where: { userId },
      transaction: trx
    });

    return new LoggedOutDto();
  }

  async refreshToken({ refreshToken, trx }: RefreshTokenInterface) {
    if (!refreshToken) throw new CorruptedTokenException();

    const { id: tokenId } = this.verifyToken({
      token: refreshToken
    });

    const token = await this.getTokenById({ tokenId, trx });

    if (!token) throw new InvalidTokenException();

    const { id: userId } = await this.usersService.getUserById({
      id: token.userId,
      trx
    });

    const generateTokensPayload: GenerateTokensInterface = {
      userId,
      trx
    };

    const { _at, _rt } = await this.generateTokens(generateTokensPayload);

    return { _at, _rt };
  }

  async checkUserMfaStatus({ mfaCode, userSettings }: CheckMfaStatusInterface) {
    const { twoFaToken: userTwoFaToken } = userSettings;

    if (!mfaCode && userTwoFaToken) return new TokenTwoFaRequiredDto();

    if (mfaCode && userTwoFaToken) {
      const delta = speakeasy.totp.verifyDelta({
        secret: userTwoFaToken,
        encoding: 'base32',
        token: mfaCode
      });

      if (!delta || (delta && delta.delta !== 0))
        throw new WrongCodeException();
    }
  }

  private verifyToken({ token }: VerifyTokenInterface) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.jwtAuthConfig.secret
      });
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError)
        throw new ExpiredTokenException();
      else if (error instanceof jwt.JsonWebTokenError)
        throw new InvalidTokenException();
    }
  }

  private generateAccessToken({ userId }: GenerateAccessTokenInterface) {
    const payload = { userId, type: 'access' };

    const options = {
      expiresIn: this.configService.jwtAuthConfig.accessExpiresIn,
      secret: this.configService.jwtAuthConfig.secret
    };

    return this.jwtService.sign(payload, options);
  }

  private generateRefreshToken() {
    const id = uuid.v4();
    const payload = { id, type: 'refresh' };
    const options = {
      expiresIn: this.configService.jwtAuthConfig.refreshExpiresIn,
      secret: this.configService.jwtAuthConfig.secret
    };

    return { id, token: this.jwtService.sign(payload, options) };
  }

  private async updateRefreshToken({
    userId,
    tokenId,
    trx: transaction
  }: UpdateRefreshTokenInterface) {
    const currentSession = await this.sessionRepository.findOne({
      rejectOnEmpty: undefined,
      where: { userId },
      transaction
    });

    if (currentSession) {
      await this.sessionRepository.destroy({
        where: { id: currentSession.id },
        transaction
      });
    }

    await this.sessionRepository.create(
      {
        userId,
        tokenId
      },
      { transaction }
    );
  }

  async generateTokens({ userId, trx }: GenerateTokensInterface) {
    const _at = this.generateAccessToken({
      userId
    });

    const { id: tokenId, token: _rt } = this.generateRefreshToken();

    await this.updateRefreshToken({
      userId,
      tokenId,
      trx
    });

    return { _at, _rt };
  }

  private async getTokenById({ tokenId, trx: transaction }: GetTokenInterface) {
    return this.sessionRepository.findOne({
      rejectOnEmpty: undefined,
      where: { tokenId },
      transaction
    });
  }
}
