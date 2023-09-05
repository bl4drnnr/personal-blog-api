import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { GetUserByIdInterface } from '@interfaces/get-user-by-id.interface';
import { GetUserByEmailInterface } from '@interfaces/get-user-by-email.interface';
import { VerifyUserCredentialsInterface } from '@interfaces/verify-user-credentials.interface';
import { CryptographicService } from '@shared/cryptographic.service';
import { UserSettings } from '@models/user-settings.model';
import { CreateUserSettingsInterface } from '@interfaces/create-user-settings.interface';
import { CreateUserInterface } from '@interfaces/create-user.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(UserSettings)
    private readonly userSettingsRepository: typeof UserSettings
  ) {}

  async getUserById({ id, trx: transaction }: GetUserByIdInterface) {
    return await this.userRepository.findByPk(id, {
      include: { all: true },
      transaction
    });
  }

  async getUserByEmail({ email, trx: transaction }: GetUserByEmailInterface) {
    return await this.userRepository.findOne({
      rejectOnEmpty: undefined,
      where: { email },
      include: [{ all: true }],
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

  async createUser({ payload, trx: transaction }: CreateUserInterface) {
    const user = await this.userRepository.create(payload, { transaction });
    await this.createUserSettings({ userId: user.id, trx: transaction });
    return user;
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
