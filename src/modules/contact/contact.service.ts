import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ContactInterface } from '@interfaces/contact.interface';
import { EmailService } from '@shared/email.service';
import { ContactedDto } from '@dto/contacted.dto';
import { ContactPage } from '@models/contact-page.model';
import { ContactTile } from '@models/contact-tile.model';
import { ContactMessage } from '@models/contact-message.model';
import { StaticAssetsService } from '@modules/static-assets.service';
import {
  ContactPageAdminDto,
  ContactTileDto
} from '@dto/contact/responses/contact-page-data.dto';
import { UpdateContactPageInterface } from '@interfaces/contact-page.interface';
import { CreateContactTileDto } from '@dto/contact/requests/create-contact-tile.dto';
import { UpdateContactTileDto } from '@dto/contact/requests/update-contact-tile.dto';
import { Op } from 'sequelize';
import { GetContactMessagesInterface } from '@interfaces/get-contact-messages.interface';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactPage) private contactPageModel: typeof ContactPage,
    @InjectModel(ContactTile) private contactTileModel: typeof ContactTile,
    @InjectModel(ContactMessage) private contactMessageModel: typeof ContactMessage,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    private readonly staticAssetsService: StaticAssetsService
  ) {}

  async contact({ payload }: ContactInterface) {
    const { name, message, email } = payload;

    await this.contactMessageModel.create({
      name,
      email,
      message
    });

    return new ContactedDto();
  }

  async getContactPageData() {
    const contactPage = await this.findContactPageOrFail();
    const contactTiles = await this.findContactTiles(contactPage.id);

    const [heroImageMain, heroImageSecondary, ogImage] = await Promise.all([
      this.getStaticAsset(contactPage.heroImageMainId),
      this.getStaticAsset(contactPage.heroImageSecondaryId),
      this.getStaticAsset(contactPage.ogImageId)
    ]);

    return {
      pageContent: {
        title: contactPage.title,
        subtitle: contactPage.subtitle,
        description: contactPage.description,
        carouselWords: this.parseCarouselWords(contactPage.carouselWords),
        submitButtonText: contactPage.submitButtonText,
        successMessage: contactPage.successMessage,
        errorMessage: contactPage.errorMessage
      },
      layoutData: {
        footerText: contactPage.footerText,
        heroImageMain,
        heroImageSecondary,
        heroImageMainAlt: contactPage.heroImageMainAlt,
        heroImageSecondaryAlt: contactPage.heroImageSecondaryAlt,
        logoText: contactPage.logoText,
        breadcrumbText: contactPage.breadcrumbText,
        heroTitle: contactPage.heroTitle,
        heroDesc: contactPage.heroDesc
      },
      seoData: {
        metaTitle: contactPage.metaTitle,
        metaDescription: contactPage.metaDescription,
        metaKeywords: contactPage.metaKeywords,
        ogTitle: contactPage.ogTitle,
        ogDescription: contactPage.ogDescription,
        ogImage,
        structuredData: contactPage.structuredData
      },
      contactTiles: this.mapContactTiles(contactTiles)
    };
  }

  async getContactPageAdmin(): Promise<ContactPageAdminDto> {
    const contactPage = await this.findContactPageOrFail();
    const contactTiles = await this.findContactTiles(contactPage.id);

    return {
      id: contactPage.id,
      title: contactPage.title,
      subtitle: contactPage.subtitle,
      description: contactPage.description,
      footerText: contactPage.footerText,
      heroImageMainId: contactPage.heroImageMainId,
      heroImageSecondaryId: contactPage.heroImageSecondaryId,
      heroImageMainAlt: contactPage.heroImageMainAlt,
      heroImageSecondaryAlt: contactPage.heroImageSecondaryAlt,
      logoText: contactPage.logoText,
      breadcrumbText: contactPage.breadcrumbText,
      heroTitle: contactPage.heroTitle,
      heroDesc: contactPage.heroDesc,
      carouselWords: contactPage.carouselWords,
      submitButtonText: contactPage.submitButtonText,
      successMessage: contactPage.successMessage,
      errorMessage: contactPage.errorMessage,
      metaTitle: contactPage.metaTitle,
      metaDescription: contactPage.metaDescription,
      metaKeywords: contactPage.metaKeywords,
      ogTitle: contactPage.ogTitle,
      ogDescription: contactPage.ogDescription,
      ogImageId: contactPage.ogImageId,
      structuredData: contactPage.structuredData,
      contactTiles: this.mapContactTiles(contactTiles)
    };
  }

  async updateContactPage({
    data,
    trx
  }: UpdateContactPageInterface): Promise<ContactPage> {
    let contactPage = await this.contactPageModel.findOne({ transaction: trx });

    if (!contactPage) {
      // Create new contact page if it doesn't exist
      contactPage = await this.contactPageModel.create(data, { transaction: trx });
    } else {
      // Update existing contact page
      await contactPage.update(data, { transaction: trx });
    }

    return contactPage;
  }

  async createContactTile(data: CreateContactTileDto): Promise<ContactTile> {
    const contactPage = await this.findContactPageOrFail();

    // If no sortOrder provided, set it to be the highest + 1
    if (!data.sortOrder) {
      const maxSortOrder = (await this.contactTileModel.max('sortOrder', {
        where: { contactPageId: contactPage.id }
      })) as number;
      data.sortOrder = (maxSortOrder || 0) + 1;
    }

    return await this.contactTileModel.create({
      ...data,
      contactPageId: contactPage.id
    });
  }

  async updateContactTile(data: UpdateContactTileDto): Promise<ContactTile> {
    const contactTile = await this.contactTileModel.findByPk(data.id);

    if (!contactTile) {
      throw new NotFoundException('Contact tile not found');
    }

    await contactTile.update(data);
    return contactTile;
  }

  async deleteContactTile(tileId: string): Promise<void> {
    const contactTile = await this.contactTileModel.findByPk(tileId);

    if (!contactTile) {
      throw new NotFoundException('Contact tile not found');
    }

    await contactTile.destroy();
  }

  async reorderContactTiles(tileIds: string[]): Promise<ContactTileDto[]> {
    const contactPage = await this.findContactPageOrFail();

    // Update sort order for each tile
    for (let i = 0; i < tileIds.length; i++) {
      await this.contactTileModel.update(
        { sortOrder: i + 1 },
        { where: { id: tileIds[i], contactPageId: contactPage.id } }
      );
    }

    // Return updated tiles
    const updatedTiles = await this.findContactTiles(contactPage.id);
    return this.mapContactTiles(updatedTiles);
  }

  // Contact Messages Management
  async getContactMessages({
    page = 0,
    pageSize = 10,
    orderBy = 'createdAt',
    order = 'DESC',
    query,
    status
  }: GetContactMessagesInterface) {
    const whereClause: any = {};

    // Handle search query (search in name, email, or message)
    if (query && query.trim()) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
        { message: { [Op.iLike]: `%${query}%` } }
      ];
    }

    // Handle status filter
    if (status && status !== '') {
      if (status === 'read') {
        whereClause.isRead = true;
      } else if (status === 'unread') {
        whereClause.isRead = false;
      }
    }

    // Calculate offset for pagination
    const offset = page * pageSize;

    // Validate orderBy field
    const allowedOrderFields = ['createdAt', 'updatedAt', 'name', 'email', 'isRead'];
    const validOrderBy = allowedOrderFields.includes(orderBy)
      ? orderBy
      : 'createdAt';

    const { count, rows } = await this.contactMessageModel.findAndCountAll({
      where: whereClause,
      order: [[validOrderBy, order]],
      limit: pageSize,
      offset: offset
    });

    return {
      rows,
      count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      pageSize
    };
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const contactMessage = await this.contactMessageModel.findByPk(messageId);

    if (!contactMessage) {
      throw new NotFoundException('Contact message not found');
    }

    await contactMessage.update({ isRead: true });
  }

  async markMessageAsUnread(messageId: string): Promise<void> {
    const contactMessage = await this.contactMessageModel.findByPk(messageId);

    if (!contactMessage) {
      throw new NotFoundException('Contact message not found');
    }

    await contactMessage.update({ isRead: false });
  }

  async deleteContactMessage(messageId: string): Promise<void> {
    const contactMessage = await this.contactMessageModel.findByPk(messageId);

    if (!contactMessage) {
      throw new NotFoundException('Contact message not found');
    }

    await contactMessage.destroy();
  }

  // Private helper methods
  private async findContactPageOrFail(): Promise<ContactPage> {
    const contactPage = await this.contactPageModel.findOne();

    if (!contactPage) {
      throw new NotFoundException('Contact page not found');
    }

    return contactPage;
  }

  private async findContactTiles(contactPageId: string): Promise<ContactTile[]> {
    return await this.contactTileModel.findAll({
      where: { contactPageId },
      include: [
        {
          association: 'iconAsset',
          required: false
        }
      ],
      order: [
        ['sortOrder', 'ASC'],
        ['createdAt', 'ASC']
      ]
    });
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

  private mapContactTiles(contactTiles: ContactTile[]): ContactTileDto[] {
    return contactTiles.map((tile) => ({
      id: tile.id,
      title: tile.title,
      content: tile.content,
      link: tile.link,
      iconAssetId: tile.iconAssetId,
      iconUrl: tile.iconAsset?.s3Url || null,
      sortOrder: tile.sortOrder
    }));
  }

  private async getStaticAsset(assetId: string): Promise<string | null> {
    if (!assetId) {
      return null;
    }

    try {
      const asset = await this.staticAssetsService.findById(assetId);
      return asset.s3Url;
    } catch (error) {
      console.warn(`Static asset not found: ${assetId}`, error);
      return null;
    }
  }
}
