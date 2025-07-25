import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { AboutPage } from '@models/about-page.model';
import { Experience } from '@models/experience.model';
import { Position } from '@models/position.model';
import { Certificate } from '@models/certificate.model';
import { CreateAboutPageDto } from '@dto/about/requests/create-about-page.dto';
import { UpdateAboutPageDto } from '@dto/about/requests/update-about-page.dto';
import { CreateExperienceDto } from '@dto/about/requests/create-experience.dto';
import { UpdateExperienceDto } from '@dto/about/requests/update-experience.dto';
import { CreateCertificateDto } from '@dto/about/requests/create-certificate.dto';
import { UpdateCertificateDto } from '@dto/about/requests/update-certificate.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(AboutPage) private aboutPageModel: typeof AboutPage,
    @InjectModel(Experience) private experienceModel: typeof Experience,
    @InjectModel(Position) private positionModel: typeof Position,
    @InjectModel(Certificate) private certificateModel: typeof Certificate
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

    return {
      pageContent: {
        title: aboutPage.title,
        content: aboutPage.content
      },
      layoutData: {
        footerText: aboutPage.footerText,
        heroImageMain: aboutPage.heroImageMain,
        heroImageSecondary: aboutPage.heroImageSecondary,
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
        ogImage: aboutPage.ogImage,
        structuredData: aboutPage.structuredData
      },
      experiences,
      certificates
    };
  }

  async getAboutPageDataAdmin() {
    return await this.getAboutPageData();
  }

  async createAboutPage({
    data,
    trx
  }: {
    data: CreateAboutPageDto;
    trx: Transaction;
  }) {
    return await this.aboutPageModel.create(data, { transaction: trx });
  }

  async updateAboutPage({
    aboutPageId,
    data,
    trx
  }: {
    aboutPageId: string;
    data: UpdateAboutPageDto;
    trx: Transaction;
  }) {
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

  async createExperience({
    data,
    trx
  }: {
    data: CreateExperienceDto;
    trx: Transaction;
  }) {
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

  async updateExperience({
    experienceId,
    data,
    trx
  }: {
    experienceId: string;
    data: UpdateExperienceDto;
    trx: Transaction;
  }) {
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

  async deleteExperience({
    experienceId,
    trx
  }: {
    experienceId: string;
    trx: Transaction;
  }) {
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

  async createCertificate({
    data,
    trx
  }: {
    data: CreateCertificateDto;
    trx: Transaction;
  }) {
    return await this.certificateModel.create(data, { transaction: trx });
  }

  async updateCertificate({
    certificateId,
    data,
    trx
  }: {
    certificateId: string;
    data: UpdateCertificateDto;
    trx: Transaction;
  }) {
    const certificate = await this.certificateModel.findByPk(certificateId);

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    await certificate.update(data, { transaction: trx });
    return certificate;
  }

  async deleteCertificate({
    certificateId,
    trx
  }: {
    certificateId: string;
    trx: Transaction;
  }) {
    const certificate = await this.certificateModel.findByPk(certificateId);

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    await certificate.destroy({ transaction: trx });
    return { message: 'Certificate deleted successfully' };
  }
}
