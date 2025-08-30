import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Newsletter } from '@models/newsletters.model';
import { Op } from 'sequelize';
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
import { SubscribePageNotFoundException } from '@exceptions/subscribe-page-not-found.exception';

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
      throw new SubscribePageNotFoundException();
    }
    return subscribePage;
  }

  async getSubscribePageData(): Promise<SubscribePageDataDto> {
    const subscribePage = await this.findSubscribePageOrFail();

    // Get static assets for images
    const heroImageMain = await StaticAssetModel.findByPk(
      subscribePage.heroImageMainId
    );
    const heroImageSecondary = await StaticAssetModel.findByPk(
      subscribePage.heroImageSecondaryId
    );
    const ogImage = await StaticAssetModel.findByPk(subscribePage.ogImageId);

    return {
      pageContent: {
        title: subscribePage.title,
        subtitle: subscribePage.subtitle,
        description: subscribePage.description,
        carouselWords: this.parseCarouselWords(subscribePage.carouselWords),
        submitButtonText: subscribePage.submitButtonText,
        successMessage: subscribePage.successMessage,
        errorMessage: subscribePage.errorMessage,
        emailPlaceholder: subscribePage.emailPlaceholder,
        privacyText: subscribePage.privacyText
      },
      layoutData: {
        heroImageMain: heroImageMain.s3Url,
        heroImageSecondary: heroImageSecondary.s3Url,
        heroImageMainAlt: subscribePage.heroImageMainAlt,
        heroImageSecondaryAlt: subscribePage.heroImageSecondaryAlt,
        logoText: subscribePage.logoText,
        breadcrumbText: subscribePage.breadcrumbText,
        heroTitle: subscribePage.heroTitle,
        heroDesc: subscribePage.heroDesc
      },
      seoData: {
        metaTitle: subscribePage.metaTitle,
        metaDescription: subscribePage.metaDescription,
        metaKeywords: subscribePage.metaKeywords,
        ogTitle: subscribePage.ogTitle,
        ogDescription: subscribePage.ogDescription,
        ogImage: ogImage?.s3Url || null,
        structuredData: subscribePage.structuredData || {}
      }
    };
  }

  async getSubscribePageAdmin(): Promise<SubscribePageAdminDto> {
    const subscribePage = await this.findSubscribePageOrFail();

    return {
      id: subscribePage.id,
      title: subscribePage.title,
      subtitle: subscribePage.subtitle,
      description: subscribePage.description,
      heroImageMainId: subscribePage.heroImageMainId,
      heroImageSecondaryId: subscribePage.heroImageSecondaryId,
      heroImageMainAlt: subscribePage.heroImageMainAlt,
      heroImageSecondaryAlt: subscribePage.heroImageSecondaryAlt,
      logoText: subscribePage.logoText,
      breadcrumbText: subscribePage.breadcrumbText,
      heroTitle: subscribePage.heroTitle,
      heroDesc: subscribePage.heroDesc,
      carouselWords: subscribePage.carouselWords,
      submitButtonText: subscribePage.submitButtonText,
      successMessage: subscribePage.successMessage,
      errorMessage: subscribePage.errorMessage,
      emailPlaceholder: subscribePage.emailPlaceholder,
      privacyText: subscribePage.privacyText,
      metaTitle: subscribePage.metaTitle,
      metaDescription: subscribePage.metaDescription,
      metaKeywords: subscribePage.metaKeywords,
      ogTitle: subscribePage.ogTitle,
      ogDescription: subscribePage.ogDescription,
      ogImageId: subscribePage.ogImageId,
      structuredData: subscribePage.structuredData
    };
  }

  async updateSubscribePage(
    data: UpdateSubscribePageDto
  ): Promise<SubscribePageAdminDto> {
    const subscribePage = await this.findSubscribePageOrFail();
    await subscribePage.update(data);
    return this.getSubscribePageAdmin();
  }

  private parseCarouselWords(carouselWords: string): string[] {
    if (!carouselWords) {
      return [];
    }
    return carouselWords
      .split(',')
      .map((word) => word.trim())
      .filter((word) => word.length > 0);
  }

  // Admin subscription management endpoints
  async listSubscriptions(params: {
    page: string;
    pageSize: string;
    order: string;
    orderBy: string;
    query?: string;
    status?: string;
  }) {
    const { page, pageSize, order, orderBy, query, status } = params;

    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 10;
    const offset = (pageNum - 1) * pageSizeNum;

    // Build where clause
    const whereClause: any = {};

    // Email search filter
    if (query && query.trim()) {
      whereClause.email = {
        [Op.iLike]: `%${query.trim()}%`
      };
    }

    // Status filter
    if (status === 'confirmed') {
      whereClause.isConfirmed = true;
    } else if (status === 'unconfirmed') {
      whereClause.isConfirmed = false;
    }

    // Build order clause
    const orderClause: any = [];
    const validOrderFields = ['email', 'isConfirmed', 'createdAt', 'updatedAt'];
    const validOrderDirections = ['ASC', 'DESC'];

    const orderField = validOrderFields.includes(orderBy) ? orderBy : 'createdAt';
    const orderDirection = validOrderDirections.includes(order.toUpperCase())
      ? order.toUpperCase()
      : 'DESC';

    orderClause.push([orderField, orderDirection]);

    // Execute query
    const { count, rows } = await this.newsletterRepository.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit: pageSizeNum,
      offset,
      attributes: ['id', 'email', 'isConfirmed', 'createdAt', 'updatedAt']
    });

    return {
      count,
      rows: rows.map((subscription) => ({
        id: subscription.id,
        email: subscription.email,
        isConfirmed: subscription.isConfirmed,
        createdAt: subscription.createdAt.toISOString(),
        updatedAt: subscription.updatedAt.toISOString()
      }))
    };
  }

  async deleteSubscription(id: string, trx?: any) {
    const subscription = await this.newsletterRepository.findByPk(id, {
      transaction: trx
    });

    if (!subscription) {
      throw new NewslettersNotFoundException();
    }

    await this.newsletterRepository.destroy({
      where: { id },
      transaction: trx
    });

    return { success: true, message: 'Subscription deleted successfully' };
  }
}
