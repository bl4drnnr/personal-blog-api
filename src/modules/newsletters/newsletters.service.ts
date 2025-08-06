import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Newsletter } from '@models/newsletters.model';
import { SubscribePage } from '@models/subscribe-page.model';
import { StaticAssetModel } from '@models/static-asset.model';
import { SubscribedToNewslettersDto } from '@dto/subscribed-to-newsletters.dto';
import { SubscriptionConfirmedDto } from '@dto/subscription-confirmed.dto';
import { SubscriptionAlreadyConfirmedException } from '@exceptions/newsletters/subscription-already-confirmed.exception';
import { NewslettersNotFoundException } from '@exceptions/newsletters/newsletters-not-found.exception';
import { UnsubscriptionConfirmedDto } from '@dto/unsubscription-confirmed.dto';
import { EmailService } from '@shared/email.service';
import { GetNewslettersByIdInterface } from '@interfaces/get-newsletters-by-id.interface';
import { ConfirmNewslettersSubscriptionByIdInterface } from '@interfaces/confirm-newsletters-subscription-by-id.interface';
import { DeleteNewslettersSubscriptionInterface } from '@interfaces/delete-newsletters-subscription.interface';
import { CreateNewslettersSubscriptionInterface } from '@interfaces/create-newsletters-subscription.interface';
import { SubscribeToNewslettersInterface } from '@interfaces/subscribe-to-newsletters.interface';
import { ConfirmNewslettersSubscriptionInterface } from '@interfaces/confirm-newsletters-subscription.interface';
import { UnsubscribeFromNewslettersInterface } from '@interfaces/unsubscribe-from-newsletters.interface';
import { UpdateSubscribePageDto } from '@dto/subscribe/requests/update-subscribe-page.dto';
import {
  SubscribePageDataDto,
  SubscribePageAdminDto
} from '@dto/subscribe/responses/subscribe-page-data.dto';

@Injectable()
export class NewslettersService {
  constructor(
    @InjectModel(Newsletter)
    private readonly newsletterRepository: typeof Newsletter,
    @InjectModel(SubscribePage)
    private readonly subscribePageModel: typeof SubscribePage,
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

  // Subscribe Page Management
  private async findSubscribePageOrFail(): Promise<SubscribePage> {
    const subscribePage = await this.subscribePageModel.findOne();
    if (!subscribePage) {
      throw new NotFoundException('Subscribe page not found');
    }
    return subscribePage;
  }

  async getSubscribePageData(): Promise<SubscribePageDataDto> {
    const subscribePage = await this.findSubscribePageOrFail();

    // Get static assets for images
    const heroImageMain = subscribePage.heroImageMainId
      ? await StaticAssetModel.findByPk(subscribePage.heroImageMainId)
      : null;
    const heroImageSecondary = subscribePage.heroImageSecondaryId
      ? await StaticAssetModel.findByPk(subscribePage.heroImageSecondaryId)
      : null;
    const ogImage = subscribePage.ogImageId
      ? await StaticAssetModel.findByPk(subscribePage.ogImageId)
      : null;

    return {
      pageContent: {
        title: subscribePage.title || '',
        subtitle: subscribePage.subtitle || '',
        description: subscribePage.description || '',
        submitButtonText: subscribePage.submitButtonText || 'Subscribe',
        successMessage: subscribePage.successMessage || 'Successfully subscribed!',
        errorMessage:
          subscribePage.errorMessage || 'An error occurred. Please try again.',
        emailPlaceholder: subscribePage.emailPlaceholder || 'Enter your email',
        privacyText: subscribePage.privacyText || ''
      },
      layoutData: {
        footerText: subscribePage.footerText || '',
        heroImageMain: heroImageMain?.s3Url || null,
        heroImageSecondary: heroImageSecondary?.s3Url || null,
        heroImageMainAlt: subscribePage.heroImageMainAlt || '',
        heroImageSecondaryAlt: subscribePage.heroImageSecondaryAlt || '',
        logoText: subscribePage.logoText || '',
        breadcrumbText: subscribePage.breadcrumbText || '',
        heroTitle: subscribePage.heroTitle || '',
        heroDesc: subscribePage.heroDesc || ''
      },
      seoData: {
        metaTitle: subscribePage.metaTitle || '',
        metaDescription: subscribePage.metaDescription || '',
        metaKeywords: subscribePage.metaKeywords || '',
        ogTitle: subscribePage.ogTitle || '',
        ogDescription: subscribePage.ogDescription || '',
        ogImage: ogImage?.s3Url || null,
        structuredData: subscribePage.structuredData || {}
      }
    };
  }

  async getSubscribePageAdmin(): Promise<SubscribePageAdminDto> {
    const subscribePage = await this.findSubscribePageOrFail();

    return {
      id: subscribePage.id,
      title: subscribePage.title || '',
      subtitle: subscribePage.subtitle || '',
      description: subscribePage.description || '',
      footerText: subscribePage.footerText || '',
      heroImageMainId: subscribePage.heroImageMainId || '',
      heroImageSecondaryId: subscribePage.heroImageSecondaryId || '',
      heroImageMainAlt: subscribePage.heroImageMainAlt || '',
      heroImageSecondaryAlt: subscribePage.heroImageSecondaryAlt || '',
      logoText: subscribePage.logoText || '',
      breadcrumbText: subscribePage.breadcrumbText || '',
      heroTitle: subscribePage.heroTitle || '',
      heroDesc: subscribePage.heroDesc || '',
      submitButtonText: subscribePage.submitButtonText || '',
      successMessage: subscribePage.successMessage || '',
      errorMessage: subscribePage.errorMessage || '',
      emailPlaceholder: subscribePage.emailPlaceholder || '',
      privacyText: subscribePage.privacyText || '',
      metaTitle: subscribePage.metaTitle || '',
      metaDescription: subscribePage.metaDescription || '',
      metaKeywords: subscribePage.metaKeywords || '',
      ogTitle: subscribePage.ogTitle || '',
      ogDescription: subscribePage.ogDescription || '',
      ogImageId: subscribePage.ogImageId || '',
      structuredData: subscribePage.structuredData || {}
    };
  }

  async updateSubscribePage(
    data: UpdateSubscribePageDto
  ): Promise<SubscribePageAdminDto> {
    const subscribePage = await this.findSubscribePageOrFail();
    await subscribePage.update(data);
    return this.getSubscribePageAdmin();
  }
}
