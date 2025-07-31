import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AboutPage } from '@models/about-page.model';
import { Experience } from '@models/experience.model';
import { Position } from '@models/position.model';
import { Certificate } from '@models/certificate.model';
import { CreateExperienceDto } from '@dto/create-experience.dto';
import { CreateAboutPageInterface } from '@interfaces/create-about-page.interface';
import { UpdateAboutPageInterface } from '@interfaces/update-about-page.interface';
import { CreateExperienceInterface } from '@interfaces/create-experience.interface';
import { UpdateExperienceInterface } from '@interfaces/update-experience.interface';
import { DeleteExperienceInterface } from '@interfaces/delete-experience.interface';
import { CreateCertificateInterface } from '@interfaces/create-certificate.interface';
import { UpdateCertificateInterface } from '@interfaces/update-certificate.interface';
import { DeleteCertificateInterface } from '@interfaces/delete-certificate.interface';
import { StaticAssetsService } from '@modules/static-assets.service';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(AboutPage) private aboutPageModel: typeof AboutPage,
    @InjectModel(Experience) private experienceModel: typeof Experience,
    @InjectModel(Position) private positionModel: typeof Position,
    @InjectModel(Certificate) private certificateModel: typeof Certificate,
    private readonly staticAssetsService: StaticAssetsService
  ) {}

  async getAboutPageData() {
    const [aboutPage, experiences, certificates] = await Promise.all([
      this.aboutPageModel.findOne(),
      this.experienceModel.findAll({
        include: [
          {
            model: Position,
            as: 'positions',
            separate: true,
            order: [
              ['order', 'ASC'],
              ['startDate', 'DESC']
            ]
          }
        ],
        order: [['order', 'ASC']]
      }),
      this.certificateModel.findAll({
        order: [
          ['order', 'ASC'],
          ['issuedDate', 'DESC']
        ]
      })
    ]);

    if (!aboutPage) {
      throw new NotFoundException('About page content not found');
    }

    // Fetch actual images using asset IDs
    let heroImageMain = null;
    let heroImageSecondary = null;
    let ogImage = null;

    try {
      if (aboutPage.heroImageMainId) {
        heroImageMain = await this.staticAssetsService.findById(
          aboutPage.heroImageMainId
        );
      }
    } catch (error) {
      console.warn('Hero main image not found:', aboutPage.heroImageMainId);
    }

    try {
      if (aboutPage.heroImageSecondaryId) {
        heroImageSecondary = await this.staticAssetsService.findById(
          aboutPage.heroImageSecondaryId
        );
      }
    } catch (error) {
      console.warn(
        'Hero secondary image not found:',
        aboutPage.heroImageSecondaryId
      );
    }

    try {
      if (aboutPage.ogImageId) {
        ogImage = await this.staticAssetsService.findById(aboutPage.ogImageId);
      }
    } catch (error) {
      console.warn('OG image not found:', aboutPage.ogImageId);
    }

    return {
      pageContent: {
        title: aboutPage.title,
        content: aboutPage.content
      },
      layoutData: {
        footerText: aboutPage.footerText,
        heroImageMain: heroImageMain,
        heroImageSecondary: heroImageSecondary,
        heroImageMainAlt: aboutPage.heroImageMainAlt,
        heroImageSecondaryAlt: aboutPage.heroImageSecondaryAlt,
        logoText: aboutPage.logoText,
        breadcrumbText: aboutPage.breadcrumbText,
        heroTitle: aboutPage.heroTitle,
        contactTiles: aboutPage.contactTiles
      },
      seoData: {
        metaTitle: aboutPage.metaTitle,
        metaDescription: aboutPage.metaDescription,
        metaKeywords: aboutPage.metaKeywords,
        ogTitle: aboutPage.ogTitle,
        ogDescription: aboutPage.ogDescription,
        ogImage: ogImage,
        structuredData: aboutPage.structuredData
      },
      experiences,
      certificates
    };
  }

  async getAboutPageDataAdmin() {
    const aboutPage = await this.aboutPageModel.findOne();

    if (!aboutPage) {
      throw new NotFoundException('About page content not found');
    }

    // Return data matching the AboutPageData interface exactly
    return {
      id: aboutPage.id,
      title: aboutPage.title,
      content: aboutPage.content,
      footerText: aboutPage.footerText,
      heroImageMainId: aboutPage.heroImageMainId,
      heroImageSecondaryId: aboutPage.heroImageSecondaryId,
      heroImageMainAlt: aboutPage.heroImageMainAlt,
      heroImageSecondaryAlt: aboutPage.heroImageSecondaryAlt,
      logoText: aboutPage.logoText,
      breadcrumbText: aboutPage.breadcrumbText,
      heroTitle: aboutPage.heroTitle,
      metaTitle: aboutPage.metaTitle,
      metaDescription: aboutPage.metaDescription,
      metaKeywords: aboutPage.metaKeywords,
      ogTitle: aboutPage.ogTitle,
      ogDescription: aboutPage.ogDescription,
      ogImageId: aboutPage.ogImageId,
      structuredData: aboutPage.structuredData
    };
  }

  async createAboutPage({ data, trx }: CreateAboutPageInterface) {
    return await this.aboutPageModel.create(data, { transaction: trx });
  }

  async updateAboutPage({ aboutPageId, data, trx }: UpdateAboutPageInterface) {
    const aboutPage = await this.aboutPageModel.findByPk(aboutPageId);

    if (!aboutPage) {
      throw new NotFoundException('About page not found');
    }

    await aboutPage.update(data, { transaction: trx });
    return aboutPage;
  }

  async getExperiences() {
    return await this.experienceModel.findAll({
      include: [
        {
          model: Position,
          as: 'positions',
          separate: true,
          order: [
            ['order', 'ASC'],
            ['startDate', 'DESC']
          ]
        }
      ],
      order: [['order', 'ASC']]
    });
  }

  async createExperience({ data, trx }: CreateExperienceInterface) {
    const { positions, ...experienceData } = data;

    const experience = await this.experienceModel.create(experienceData, {
      transaction: trx
    });

    if (positions && positions.length > 0) {
      const positionsWithExperienceId = positions.map((position, index) => ({
        ...position,
        experienceId: experience.id,
        order: position.order || index
      }));

      await this.positionModel.bulkCreate(positionsWithExperienceId, {
        transaction: trx
      });
    }

    return await this.experienceModel.findByPk(experience.id, {
      include: [{ model: Position, as: 'positions' }],
      transaction: trx
    });
  }

  async updateExperience({ experienceId, data, trx }: UpdateExperienceInterface) {
    const experience = await this.experienceModel.findByPk(experienceId);

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    const { positions, ...experienceData } = data as CreateExperienceDto;

    await experience.update(experienceData, { transaction: trx });

    if (positions) {
      await this.positionModel.destroy({
        where: { experienceId },
        transaction: trx
      });

      if (positions.length > 0) {
        const positionsWithExperienceId = positions.map((position, index) => ({
          ...position,
          experienceId,
          order: position.order || index
        }));

        await this.positionModel.bulkCreate(positionsWithExperienceId, {
          transaction: trx
        });
      }
    }

    return await this.experienceModel.findByPk(experienceId, {
      include: [{ model: Position, as: 'positions' }],
      transaction: trx
    });
  }

  async deleteExperience({ experienceId, trx }: DeleteExperienceInterface) {
    const experience = await this.experienceModel.findByPk(experienceId);

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    await this.positionModel.destroy({
      where: { experienceId },
      transaction: trx
    });

    await experience.destroy({ transaction: trx });

    return { message: 'Experience deleted successfully' };
  }

  async getCertificates() {
    return await this.certificateModel.findAll({
      order: [
        ['order', 'ASC'],
        ['issuedDate', 'DESC']
      ]
    });
  }

  async createCertificate({ data, trx }: CreateCertificateInterface) {
    return await this.certificateModel.create(data, { transaction: trx });
  }

  async updateCertificate({ certificateId, data, trx }: UpdateCertificateInterface) {
    const certificate = await this.certificateModel.findByPk(certificateId);

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    await certificate.update(data, { transaction: trx });
    return certificate;
  }

  async deleteCertificate({ certificateId, trx }: DeleteCertificateInterface) {
    const certificate = await this.certificateModel.findByPk(certificateId);

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    await certificate.destroy({ transaction: trx });
    return { message: 'Certificate deleted successfully' };
  }
}
