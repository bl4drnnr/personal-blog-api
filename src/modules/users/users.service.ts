import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { GetUserByIdInterface } from '@interfaces/get-user-by-id.interface';
import { GetUserByEmailInterface } from '@interfaces/get-user-by-email.interface';
import { VerifyUserCredentialsInterface } from '@interfaces/verify-user-credentials.interface';
import { CryptographicService } from '@shared/cryptographic.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    @InjectModel(User) private userRepository: typeof User
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
}
