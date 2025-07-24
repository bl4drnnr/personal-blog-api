import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Newsletter } from '@models/newsletters.model';
import { SubscribedToNewslettersDto } from '@dto/newsletters/responses/subscribed-to-newsletters.dto';
import { SubscriptionConfirmedDto } from '@dto/newsletters/responses/subscription-confirmed.dto';
import { SubscriptionAlreadyConfirmedException } from '@exceptions/newsletters/subscription-already-confirmed.exception';
import { NewslettersNotFoundException } from '@exceptions/newsletters/newsletters-not-found.exception';
import { UnsubscriptionConfirmedDto } from '@dto/newsletters/responses/unsubscription-confirmed.dto';
import { EmailService } from '@shared/email.service';
import { GetNewslettersByIdInterface } from '@interfaces/get-newsletters-by-id.interface';
import { ConfirmNewslettersSubscriptionByIdInterface } from '@interfaces/confirm-newsletters-subscription-by-id.interface';
import { DeleteNewslettersSubscriptionInterface } from '@interfaces/delete-newsletters-subscription.interface';
import { CreateNewslettersSubscriptionInterface } from '@interfaces/create-newsletters-subscription.interface';
import { SubscribeToNewslettersInterface } from '@interfaces/subscribe-to-newsletters.interface';
import { ConfirmNewslettersSubscriptionInterface } from '@interfaces/confirm-newsletters-subscription.interface';
import { UnsubscribeFromNewslettersInterface } from '@interfaces/unsubscribe-from-newsletters.interface';

@Injectable()
export class NewslettersService {
  constructor(
    @InjectModel(Newsletter)
    private readonly newsletterRepository: typeof Newsletter,
    private readonly emailService: EmailService
  ) {}

  async getNewslettersById({ newslettersId, trx }: GetNewslettersByIdInterface) {
    return this.newsletterRepository.findByPk(newslettersId, {
      transaction: trx
    });
  }

  async getNewslettersByEmail({ email, trx }) {
    return this.newsletterRepository.findOne({
      where: { email },
      transaction: trx
    });
  }

  async confirmNewslettersSubscriptionById({
    newslettersId,
    trx
  }: ConfirmNewslettersSubscriptionByIdInterface) {
    await this.newsletterRepository.update(
      {
        isConfirmed: true
      },
      { where: { id: newslettersId }, transaction: trx }
    );
  }

  async deleteNewslettersSubscriptionById({
    newslettersId,
    trx
  }: DeleteNewslettersSubscriptionInterface) {
    await this.newsletterRepository.destroy({
      where: { id: newslettersId },
      transaction: trx
    });
  }

  async createNewslettersSubscription({
    email,
    trx
  }: CreateNewslettersSubscriptionInterface) {
    return await this.newsletterRepository.create({ email }, { transaction: trx });
  }

  async subscribeToNewsletters({ payload, trx }: SubscribeToNewslettersInterface) {
    const { email } = payload;

    const existingNewsletter = await this.getNewslettersByEmail({
      email,
      trx
    });

    if (existingNewsletter) return new SubscribedToNewslettersDto();

    const newsletters = await this.createNewslettersSubscription({
      email,
      trx
    });

    await this.emailService.sendSubscriptionConfirmationEmail({
      to: email,
      newslettersId: newsletters.id
    });

    return new SubscribedToNewslettersDto();
  }

  async confirmNewslettersSubscription({
    newslettersId,
    trx
  }: ConfirmNewslettersSubscriptionInterface) {
    const existingNewsletters = await this.getNewslettersById({
      newslettersId,
      trx
    });

    if (!existingNewsletters) throw new NewslettersNotFoundException();

    if (existingNewsletters && existingNewsletters.isConfirmed)
      throw new SubscriptionAlreadyConfirmedException();

    await this.confirmNewslettersSubscriptionById({
      newslettersId,
      trx
    });

    return new SubscriptionConfirmedDto();
  }

  async unsubscribeFromNewsletters({
    newslettersId,
    trx
  }: UnsubscribeFromNewslettersInterface) {
    const existingNewsletters = await this.getNewslettersById({
      newslettersId,
      trx
    });

    if (!existingNewsletters) throw new NewslettersNotFoundException();

    await this.deleteNewslettersSubscriptionById({
      newslettersId,
      trx
    });

    return new UnsubscriptionConfirmedDto();
  }
}
