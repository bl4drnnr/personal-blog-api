import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { UserSettings } from '@models/user-settings.model';
import { CryptographicService } from '@shared/cryptographic.service';
import { EmailService } from '@shared/email.service';
import { GetUserByEmailInterface } from '@interfaces/get-user-by-email.interface';
import { UpdateUserSettingsInterface } from '@interfaces/update-user-settings.interface';
import { UpdateUserInterface } from '@interfaces/update-user.interface';
import { GetUserByIdInterface } from '@interfaces/get-user-by-id.interface';
import { VerifyUserCredentialsInterface } from '@interfaces/verify-user-credentials.interface';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { ForgotPasswordInterface } from '@interfaces/forgot-password.interface';
import { ResetPasswordEmailDto } from '@dto/reset-password-email.dto';
import { TimeService } from '@shared/time.service';
import { PasswordChangedException } from '@exceptions/password-changed.exception';
import { GetUserInfoInterface } from '@interfaces/get-user-info.interface';
import { GetUserInfoResponseDto } from '@dto/get-user-info-response.dto';
import { CreateUserSettingsInterface } from '@interfaces/create-user-settings.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    private readonly emailService: EmailService,
    private readonly timeService: TimeService,
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
    const { email } = payload;

    const user = await this.getUserByEmail({
      email,
      trx
    });

    if (!user) return new ResetPasswordEmailDto();

    const { userSettings } = user;

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: userSettings.passwordChanged,
      seconds: 86400
    });

    if (isWithinDay) throw new PasswordChangedException();

    return new ResetPasswordEmailDto();
  }

  async getUserInfo({ userId, trx }: GetUserInfoInterface) {
    const { firstName, lastName, email } = await this.getUserById({
      id: userId,
      trx
    });

    return new GetUserInfoResponseDto({
      firstName,
      lastName,
      email
    });
  }

  async getSecurityInfo({ userId, trx }: { userId: string; trx: any }) {
    const user = await this.getUserById({
      id: userId,
      trx
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      userId: user.id,
      email: user.email,
      isMfaEnabled: user.isMfaSet,
      lastPasswordChange: user.userSettings?.passwordChanged || null,
      sessionInfo: {
        currentSession: {
          device: 'Web Browser',
          location: 'Unknown',
          lastActivity: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      },
      accountInfo: {
        accountType: 'Administrator',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  async updateUserProfile({
    userId,
    payload,
    trx
  }: {
    userId: string;
    payload: { firstName?: string; lastName?: string; email?: string };
    trx: any;
  }) {
    await this.updateUser({
      userId,
      payload,
      trx
    });

    // Return updated user info
    return this.getUserInfo({ userId, trx });
  }

  async changePassword({
    userId,
    payload,
    trx
  }: {
    userId: string;
    payload: { currentPassword: string; newPassword: string };
    trx: any;
  }) {
    const user = await this.getUserById({ id: userId, trx });

    if (!user || !user.password) {
      throw new WrongCredentialsException();
    }

    // Verify current password
    const passwordEquals = await this.cryptographicService.comparePasswords({
      dataToCompare: payload.currentPassword,
      hash: user.password
    });

    if (!passwordEquals) {
      throw new WrongCredentialsException();
    }

    // Hash new password
    const hashedNewPassword = await this.cryptographicService.hashPassword({
      password: payload.newPassword
    });

    // Update password
    await this.updateUser({
      userId,
      payload: { password: hashedNewPassword },
      trx
    });

    // Update password changed timestamp
    await this.updateUserSettings({
      userId,
      payload: { passwordChanged: new Date() },
      trx
    });

    return { message: 'Password changed successfully' };
  }

  private async createUserSettings({
    userId,
    trx: transaction
  }: CreateUserSettingsInterface) {
    return await this.userSettingsRepository.create({ userId }, { transaction });
  }
}
