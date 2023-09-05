import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { CreateConfirmHashInterface } from '@interfaces/create-confirm-hash.interface';

@Injectable()
export class ConfirmationHashService {
  constructor(
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
}
