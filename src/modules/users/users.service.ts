import * as bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { AuthService } from '@auth/auth.service';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { UserTokensDto } from '@dto/user-tokens.dto';
import { SignInDto } from '@dto/sign-in.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(User) private userRepository: typeof User
  ) {}

  async singIn(payload: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email: payload.email }
    });
    if (!user) throw new WrongCredentialsException();

    const passwordEquality = await bcryptjs.compare(
      payload.password,
      user.password
    );
    if (!passwordEquality) throw new WrongCredentialsException();

    const { _at, _rt } = await this.authService.updateTokens({
      userId: user.id,
      email: user.email
    });

    return new UserTokensDto({ _at, _rt });
  }

  async logout({ userId }: { userId: string }) {
    return await this.authService.deleteRefreshToken(userId);
  }
}
