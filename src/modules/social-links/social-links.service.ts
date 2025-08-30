import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SocialLinkModel } from '@models/social-link.model';
import { StaticAssetModel } from '@models/static-asset.model';
import { PublicSocialLinkDto } from '@dto/social-links/responses/social-link.dto';
import { UpdateSocialLinksInterface } from '@interfaces/update-social-links.interface';

@Injectable()
export class SocialLinksService {
  constructor(
    @InjectModel(SocialLinkModel)
    private readonly socialLinkModel: typeof SocialLinkModel
  ) {}

  async getPublicSocialLinks(): Promise<Array<PublicSocialLinkDto>> {
    const socialLinks = await this.socialLinkModel.findAll({
      include: [
        {
          model: StaticAssetModel,
          as: 'icon',
          attributes: ['s3Url']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    return socialLinks.map((link) => ({
      url: link.url,
      alt: link.alt,
      icon: link.icon.s3Url
    }));
  }

  async getAdminSocialLinks() {
    const socialLinks = await this.socialLinkModel.findAll({
      order: [['createdAt', 'ASC']]
    });

    return socialLinks.map((link) => ({
      id: link.id,
      url: link.url,
      alt: link.alt,
      iconId: link.iconId,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt
    }));
  }

  async updateSocialLinks(payload: UpdateSocialLinksInterface) {
    const { data, trx } = payload;

    // Delete all existing social links
    await this.socialLinkModel.destroy({
      where: {},
      transaction: trx
    });

    // Create new social links
    await this.socialLinkModel.bulkCreate(data.socialLinks, {
      transaction: trx
    });

    return { message: 'Social links has been updated successfully.' };
  }
}
