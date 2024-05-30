import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { UserSettings } from '@models/user-settings.model';
import { CryptographicService } from '@shared/cryptographic.service';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { EmailService } from '@shared/email.service';
import { GetUserByEmailInterface } from '@interfaces/get-user-by-email.interface';
import { CreateUserInterface } from '@interfaces/create-user.interface';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { UpdateUserSettingsInterface } from '@interfaces/update-user-settings.interface';
import { UpdateUserInterface } from '@interfaces/update-user.interface';
import { GetUserSettingsInterface } from '@interfaces/get-user-settings.interface';
import { GetUserByIdInterface } from '@interfaces/get-user-by-id.interface';
import { VerifyUserCredentialsInterface } from '@interfaces/verify-user-credentials.interface';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { ForgotPasswordInterface } from '@interfaces/forgot-password.interface';
import { ResetPasswordEmailDto } from '@dto/reset-password-email.dto';
import { TimeService } from '@shared/time.service';
import { PasswordChangedException } from '@exceptions/password-changed.exception';
import { WrongTimeframeException } from '@exceptions/wrong-timeframe.exception';
import { GetUserInfoInterface } from '@interfaces/get-user-info.interface';
import { CryptoHashAlgorithm } from '@interfaces/crypto-hash-algorithm.enum';
import { GetUserInfoResponseDto } from '@dto/get-user-info-response.dto';
import { GetUserSecuritySettingsInterface } from '@interfaces/get-user-security-settings.interface';
import { GetUserSecResponseDto } from '@dto/get-user-sec-reponse.dto';
import { UpdateUserInfoInterface } from '@interfaces/update-user-info.interface';
import { GetUserByRecoveryKeysInterface } from '@interfaces/get-user-by-recovery-keys.interface';
import { WrongRecoveryKeysException } from '@exceptions/wrong-recovery-keys.exception';
import { UserUpdatedDto } from '@dto/user-updated.dto';
import { DeleteUserAccountInterface } from '@interfaces/delete-user-account.interface';
import { CreateUserSettingsInterface } from '@interfaces/create-user-settings.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    private readonly emailService: EmailService,
    private readonly timeService: TimeService,
    @Inject(forwardRef(() => ConfirmationHashService))
    private readonly confirmationHashService: ConfirmationHashService,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(UserSettings)
    private readonly userSettingsRepository: typeof UserSettings
  ) {}

  async getUserByEmail({ email, trx: transaction }: GetUserByEmailInterface) {
    return await this.userRepository.findOne({
      rejectOnEmpty: undefined,
      where: { email },
      include: { all: true },
      transaction
    });
  }

  async createUser({ payload, trx: transaction }: CreateUserInterface) {
    const user = await this.userRepository.create(payload, { transaction });
    await this.createUserSettings({ userId: user.id, trx: transaction });
    return user;
  }

  async updateUserSettings({
    payload,
    userId,
    trx: transaction
  }: UpdateUserSettingsInterface) {
    await this.userSettingsRepository.update(
      {
        ...payload
      },
      { returning: undefined, where: { userId }, transaction }
    );
  }

  async updateUser({ payload, userId, trx: transaction }: UpdateUserInterface) {
    await this.userRepository.update(
      {
        ...payload
      },
      { returning: undefined, where: { id: userId }, transaction }
    );
  }

  async getUserSettingsByUserId({
    userId,
    trx: transaction
  }: GetUserSettingsInterface) {
    return await this.userSettingsRepository.findOne({
      rejectOnEmpty: undefined,
      where: { userId },
      transaction
    });
  }

  async getUserById({ id, trx: transaction }: GetUserByIdInterface) {
    return await this.userRepository.findByPk(id, {
      include: { all: true },
      transaction
    });
  }

  async verifyUserCredentials({
    email,
    password,
    trx
  }: VerifyUserCredentialsInterface) {
    const user = await this.getUserByEmail({ email, trx });

    if (!user || !user.password) throw new WrongCredentialsException();

    const passwordEquals = await this.cryptographicService.comparePasswords({
      dataToCompare: password,
      hash: user.password
    });

    if (!passwordEquals) throw new WrongCredentialsException();

    return user;
  }

  async forgotPassword({ payload, trx }: ForgotPasswordInterface) {
    const { language } = payload;

    const user = await this.getUserByEmail({
      email: payload.email,
      trx
    });

    if (!user) return new ResetPasswordEmailDto();

    const { id: userId, email, firstName, lastName, userSettings } = user;

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: userSettings.passwordChanged,
      seconds: 86400
    });

    if (isWithinDay) throw new PasswordChangedException();

    const userLastPasswordResent =
      await this.confirmationHashService.getUserLastPasswordResetHash({
        userId,
        trx
      });

    if (userLastPasswordResent) {
      const isWithinThreeMinutes = this.timeService.isWithinTimeframe({
        time: userLastPasswordResent.createdAt,
        seconds: 180
      });

      if (isWithinThreeMinutes) throw new WrongTimeframeException();
    }

    await this.emailService.sendForgotPasswordEmail({
      payload: {
        to: email,
        confirmationType: Confirmation.FORGOT_PASSWORD,
        userId
      },
      userInfo: {
        firstName,
        lastName
      },
      language,
      trx
    });

    return new ResetPasswordEmailDto();
  }

  async getUserInfo({ userId, trx }: GetUserInfoInterface) {
    const userIdHash = this.cryptographicService.hash({
      data: userId,
      algorithm: CryptoHashAlgorithm.MD5
    });

    const { firstName, lastName, email } = await this.getUserById({
      id: userId,
      trx
    });

    return new GetUserInfoResponseDto({
      userIdHash,
      firstName,
      lastName,
      email
    });
  }

  async getUserSecuritySettings({
    userId,
    trx
  }: GetUserSecuritySettingsInterface) {
    const {
      userSettings: { passwordChanged, twoFaToken },
      email
    } = await this.getUserById({
      id: userId,
      trx
    });

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: passwordChanged,
      seconds: 86400
    });

    const isTwoFaSetUp = !!twoFaToken;
    const passwordCanBeChanged = passwordChanged ? !isWithinDay : true;

    return new GetUserSecResponseDto({
      passwordCanBeChanged,
      isTwoFaSetUp,
      email
    });
  }

  async updateUserInfo({ userId, payload, trx }: UpdateUserInfoInterface) {
    await this.updateUser({ payload, userId, trx });

    return new UserUpdatedDto();
  }

  async getUserByRecoveryKeysFingerprint({
    recoveryKeysFingerprint,
    trx: transaction
  }: GetUserByRecoveryKeysInterface) {
    const userSettings = await this.userSettingsRepository.findOne({
      rejectOnEmpty: undefined,
      where: { recoveryKeysFingerprint },
      transaction
    });

    if (!userSettings) throw new WrongRecoveryKeysException();

    return this.getUserById({ id: userSettings.userId, trx: transaction });
  }

  async deleteUserAccount({
    userId: id,
    trx: transaction
  }: DeleteUserAccountInterface) {
    return await this.userRepository.destroy({
      where: { id },
      transaction
    });
  }

  private async createUserSettings({
    userId,
    trx: transaction
  }: CreateUserSettingsInterface) {
    return await this.userSettingsRepository.create(
      { userId },
      { transaction }
    );
  }
}
