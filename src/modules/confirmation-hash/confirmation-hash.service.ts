import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '@modules/users.service';
import { CryptographicService } from '@shared/cryptographic.service';
import { EmailService } from '@shared/email.service';
import { AuthService } from '@modules/auth.service';
import { CreateConfirmHashInterface } from '@interfaces/create-confirm-hash.interface';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { LastPassResetHashInterface } from '@interfaces/last-pass-reset-hash.interface';

@Injectable()
export class ConfirmationHashService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectModel(ConfirmationHash)
    private readonly confirmationHashRepository: typeof ConfirmationHash
  ) {}

  async createConfirmationHash({
    payload,
    trx: transaction
  }: CreateConfirmHashInterface) {
    const { userId, confirmationType, confirmationHash } = payload;

    await this.confirmationHashRepository.create(
      {
        userId,
        confirmationHash,
        confirmationType
      },
      { transaction }
    );
  }

  async getUserLastPasswordResetHash({
    userId,
    trx: transaction
  }: LastPassResetHashInterface) {
    return this.confirmationHashRepository.findOne({
      rejectOnEmpty: undefined,
      where: {
        userId,
        confirmationType: Confirmation.FORGOT_PASSWORD
      },
      order: [['created_at', 'DESC']],
      transaction
    });
  }
}
