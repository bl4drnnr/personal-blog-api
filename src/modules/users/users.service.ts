import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { SignInRequest } from '@users/dto/sign-in/request.dto';
import { WrongCredentialsException } from '@users/exceptions/wrong-credentials.exception';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { AuthService } from '@auth/auth.service';
import { SignUpRequest } from '@users/dto/sign-up/request.dto';
import { UserAlreadyExistsException } from '@users/exceptions/user-already-exists.exception';
import { ValidatorService } from '@shared/validator.service';
import { ValidationErrorException } from '@users/exceptions/validation-error.exception';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { EmailService } from '@shared/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly validatorService: ValidatorService,
    private readonly emailService: EmailService,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(ConfirmationHash)
    private confirmationHashRepository: typeof ConfirmationHash
  ) {}

  async singIn(payload: SignInRequest) {
    const user = await this.userRepository.findOne({
      where: { email: payload.email }
    });
    if (!user) throw new WrongCredentialsException();

    const passwordEquality = await bcryptjs.compare(
      payload.password,
      user.password
    );
    if (!passwordEquality) throw new WrongCredentialsException();

    return await this.authService.updateTokens({
      userId: user.id,
      email: user.email
    });
  }

  async signUp(payload: SignUpRequest) {
    const alreadyExistingUser = await this.userRepository.findOne({
      where: { email: payload.email }
    });
    if (alreadyExistingUser) throw new UserAlreadyExistsException();

    if (
      !this.validatorService.validateEmail(payload.email) ||
      !this.validatorService.validatePassword(payload.password)
    )
      throw new ValidationErrorException();

    const hashedPassword = await bcryptjs.hash(payload.password, 10);

    const createdUser = await this.userRepository.create({
      ...payload,
      password: hashedPassword
    });

    const confirmationHash = crypto.randomBytes(20).toString('hex');
    await this.confirmationHashRepository.create({
      userId: createdUser.id,
      confirmationHash
    });
    await this.emailService.sendConfirmationEmail({
      target: payload.email,
      confirmationHash
    });

    return { message: 'success' };
  }
}
