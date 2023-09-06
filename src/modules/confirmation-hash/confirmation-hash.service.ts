import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { CreateConfirmHashInterface } from '@interfaces/create-confirm-hash.interface';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { Confirmation } from '@enums/confirmation-type.enum';
import { ConfirmAccountInterface } from '@interfaces/confirm-account.interface';
import { GetByHashInterface } from '@interfaces/get-by-hash.interface';
import { ConfirmHashInterface } from '@interfaces/confirm-hash.interface';
import { AccountAlreadyConfirmedException } from '@exceptions/account-already-confirmed.exception';
import { AccountConfirmedDto } from '@dto/account-confirmed.dto';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';
import { UsersService } from '@users/users.service';

@Injectable()
export class ConfirmationHashService {
  constructor(
    @InjectModel(ConfirmationHash)
    private readonly confirmationHashRepository: typeof ConfirmationHash,
    private readonly usersService: UsersService
  ) {}

  async confirmAccount({ confirmationHash, trx }: ConfirmAccountInterface) {
    const { user, foundHash } = await this.getUserByConfirmationHash({
      confirmationHash,
      confirmationType: Confirmation.REGISTRATION,
      trx
    });

    const { isMfaSet, userSettings } = user;

    const isAccConfirmed = foundHash.confirmed;
    const isRecoverySetUp = userSettings.recoveryKeysFingerprint;

    if (isAccConfirmed && isMfaSet && isRecoverySetUp)
      throw new AccountAlreadyConfirmedException();

    if (isAccConfirmed && !isMfaSet) return new MfaNotSetDto();

    if (isAccConfirmed && !isRecoverySetUp) return new RecoveryKeysNotSetDto();

    await this.confirmHash({
      hashId: foundHash.id,
      trx
    });

    return new AccountConfirmedDto();
  }

  async getUserByConfirmationHash({
    confirmationHash,
    confirmationType,
    trx: transaction
  }: GetByHashInterface) {
    const where: Partial<ConfirmationHash> = { confirmationHash };

    if (confirmationType) where.confirmationHash = confirmationHash;

    const foundHash = await this.confirmationHashRepository.findOne({
      where,
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    const user = await this.usersService.getUserById({
      id: foundHash.userId
    });

    return { foundHash, user };
  }

  async confirmHash({ hashId: id, trx: transaction }: ConfirmHashInterface) {
    await this.confirmationHashRepository.update(
      {
        confirmed: true
      },
      { returning: false, where: { id }, transaction }
    );
  }

  async getUserIdByConfirmationHash({
    confirmationHash,
    trx: transaction
  }: GetByHashInterface) {
    const foundHash = await this.confirmationHashRepository.findOne({
      rejectOnEmpty: undefined,
      where: { confirmationHash },
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    return { userId: foundHash.userId };
  }

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
}
