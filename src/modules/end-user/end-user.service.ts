import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EndUser } from '@models/end-user.model';
import { GetEndUserByEmailInterface } from '@interfaces/get-end-user-by-email.interface';
import { CreateEndUserInterface } from '@interfaces/create-end-user.interface';

@Injectable()
export class EndUserService {
  constructor(
    @InjectModel(EndUser)
    private readonly endUserRepository: typeof EndUser
  ) {}

  async createEndUser({ email, trx }: CreateEndUserInterface) {
    return await this.endUserRepository.create(
      { email },
      { transaction: trx, returning: true }
    );
  }

  getEndUserByEmail({ email, trx }: GetEndUserByEmailInterface) {
    return this.endUserRepository.findOne({
      where: { email },
      transaction: trx
    });
  }
}
