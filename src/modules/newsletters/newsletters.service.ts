import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Newsletter } from '@models/newsletters.model';
import { SubscribeToNewslettersInterface } from '@interfaces/subscribe-to-newsletters.interface';
import { SubscribedToNewslettersDto } from '@dto/subscribed-to-newsletters.dto';
import { EndUserService } from '@modules/end-user.service';
import { EndUser } from '@models/end-user.model';
import { GetEndUserNewslettersInterface } from '@interfaces/get-end-user-newsletters.interface';
import { ConfirmNewslettersSubscriptionInterface } from '@interfaces/confirm-newsletters-subscription.interface';
import { SubscriptionConfirmedDto } from '@dto/subscription-confirmed.dto';
import { GetNewslettersByIdInterface } from '@interfaces/get-newsletters-by-id.interface';
import { ConfirmNewslettersSubscriptionByIdInterface } from '@interfaces/confirm-newsletters-subscription-by-id.interface';
import { SubscriptionAlreadyConfirmedException } from '@exceptions/newsletters/subscription-already-confirmed.exception';
import { UnsubscribeFromNewslettersInterface } from '@interfaces/unsubscribe-from-newsletters.interface';
import { NewslettersNotFoundException } from '@exceptions/newsletters/newsletters-not-found.exception';
import { UnsubscriptionConfirmedDto } from '@dto/unsubscription-confirmed.dto';
import { DeleteNewslettersSubscriptionInterface } from '@interfaces/delete-newsletters-subscription.interface';
import { EmailService } from '@shared/email.service';
import { CreateNewslettersSubscriptionInterface } from '@interfaces/create-newsletters-subscription.interface';

@Injectable()
export class NewslettersService {
  constructor(
    @InjectModel(Newsletter)
    private readonly newsletterRepository: typeof Newsletter,
    private readonly endUserService: EndUserService,
    private readonly emailService: EmailService
  ) {}

  async getNewslettersById({
    newslettersId,
    trx
  }: GetNewslettersByIdInterface) {
    return this.newsletterRepository.findByPk(newslettersId, {
      transaction: trx
    });
  }

  async getNewslettersByEndUserId({
    endUserId,
    trx
  }: GetEndUserNewslettersInterface) {
    return this.newsletterRepository.findOne({
      where: { endUserId },
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
    endUserId,
    newslettersLanguage,
    trx
  }: CreateNewslettersSubscriptionInterface) {
    return await this.newsletterRepository.create(
      { endUserId, newslettersLanguage },
      { transaction: trx }
    );
  }

  async subscribeToNewsletters({
    payload,
    language,
    trx
  }: SubscribeToNewslettersInterface) {
    const { email } = payload;

    let existingUser: EndUser;

    existingUser = await this.endUserService.getEndUserByEmail({
      email,
      trx
    });

    if (!existingUser) {
      existingUser = await this.endUserService.createEndUser({
        email,
        trx
      });

      const newsletters = await this.createNewslettersSubscription({
        endUserId: existingUser.id,
        newslettersLanguage: language,
        trx
      });

      await this.emailService.sendSubscriptionConfirmationEmail({
        to: existingUser.email,
        newslettersId: newsletters.id,
        language
      });

      return new SubscribedToNewslettersDto();
    }

    const existingNewsletter = await this.getNewslettersByEndUserId({
      endUserId: existingUser.id,
      trx
    });

    if (existingNewsletter) return new SubscribedToNewslettersDto();

    const newsletters = await this.createNewslettersSubscription({
      endUserId: existingUser.id,
      newslettersLanguage: language,
      trx
    });

    await this.emailService.sendSubscriptionConfirmationEmail({
      to: existingUser.email,
      newslettersId: newsletters.id,
      language
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

    if (!existingNewsletters)
      throw new NewslettersNotFoundException();

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

    if (!existingNewsletters)
      throw new NewslettersNotFoundException();

    await this.deleteNewslettersSubscriptionById({
      newslettersId,
      trx
    });

    return new UnsubscriptionConfirmedDto();
  }
}
