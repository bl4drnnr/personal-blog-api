import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Author } from '@models/author.model';
import { Experience } from '@models/experience.model';
import { ExperiencePosition } from '@models/experience-position.model';
import { Cert } from '@models/cert.model';
import { Social } from '@models/social.model';
import { GetSelectedAuthorInterface } from '@interfaces/get-selected-author.interface';
import { GetSelectedExperiencesInterface } from '@interfaces/get-selected-experiences.interface';
import { GetSelectedCertificationsInterface } from '@interfaces/get-selected-certifications.interface';
import { CreateAuthorInterface } from '@interfaces/create-author.interface';
import { ApiConfigService } from '@shared/config.service';
import { S3 } from 'aws-sdk';
import { WrongPictureException } from '@exceptions/wrong-picture.exception';
import { CryptoHashAlgorithm } from '@interfaces/crypto-hash-algorithm.enum';
import { CryptographicService } from '@shared/cryptographic.service';
import { AuthorCreatedDto } from '@dto/author-created.dto';
import { UpdateAuthorSelectionStatusInterface } from '@interfaces/update-author-selection-status.interface';
import { AuthorNotFoundException } from '@exceptions/author-not-found.exception';
import { AuthorSelectionStatusUpdatedDto } from '@dto/author-selection-status-updated.dto';
import { UpdateAuthorInterface } from '@interfaces/update-author.interface';
import { GetAuthorByIdInterface } from '@interfaces/get-author-by-id.interface';
import { AuthorUpdatedDto } from '@dto/author-updated.dto';
import { DeleteAuthorInterface } from '@interfaces/delete-author.interface';
import { AuthorDeletedDto } from '@dto/author-deleted.dto';
import { GetExperienceByIdInterface } from '@interfaces/get-experience-by-id.interface';
import { CreateExperienceInterface } from '@interfaces/create-experience.interface';
import { StaticStorages } from '@interfaces/static-storages.enum';
import { ExperienceCreatedDto } from '@dto/experience-created.dto';
import { UpdateExperienceInterface } from '@interfaces/update-experience.interface';
import { ExperienceNotFoundException } from '@exceptions/experience-not-found.exception';
import { ExperienceUpdatedDto } from '@dto/experience-updated.dto';
import { DeleteExperienceInterface } from '@interfaces/delete-experience.interface';
import { ExperienceDeletedDto } from '@dto/experience-deleted.dto';

@Injectable()
export class AboutBlogService {
  constructor(
    @InjectModel(Author)
    private readonly authorsRepository: typeof Author,
    @InjectModel(Experience)
    private readonly experiencesRepository: typeof Experience,
    @InjectModel(ExperiencePosition)
    private readonly experiencePositionsRepository: typeof ExperiencePosition,
    @InjectModel(Cert)
    private readonly certsRepository: typeof Cert,
    @InjectModel(Social)
    private readonly socialsRepository: typeof Social,
    private readonly configService: ApiConfigService,
    private readonly cryptographicService: CryptographicService
  ) {}

  getSelectedAuthor({ trx }: GetSelectedAuthorInterface) {
    return this.authorsRepository.findOne({
      where: { isSelected: true },
      include: [{ model: Social, attributes: ['link', 'title'] }],
      transaction: trx
    });
  }

  getSelectedExperiences({ trx }: GetSelectedExperiencesInterface) {
    return this.experiencesRepository.findAll({
      where: { isSelected: true },
      transaction: trx
    });
  }

  getSelectedCertifications({ trx }: GetSelectedCertificationsInterface) {
    return this.certsRepository.findAll({
      where: { isSelected: true },
      transaction: trx
    });
  }

  getAuthorById({ authorId, trx }: GetAuthorByIdInterface) {
    return this.authorsRepository.findByPk(authorId, {
      include: [{ model: Social, attributes: ['id', 'link', 'title'] }],
      transaction: trx
    });
  }

  getExperienceById({ experienceId, trx }: GetExperienceByIdInterface) {
    const experiencePositionAttributes = [
      'id',
      'positionTitle',
      'positionDescription',
      'positionStartDate',
      'positionEndDate',
      'createdAt',
      'updatedAt'
    ];

    return this.experiencesRepository.findByPk(experienceId, {
      include: [
        { model: ExperiencePosition, attributes: experiencePositionAttributes }
      ],
      transaction: trx
    });
  }

  async createAuthor({ userId, payload, trx }: CreateAuthorInterface) {
    const { firstName, lastName, profilePicture, description } = payload;

    const authorPicture = await this.uploadPicture(
      profilePicture,
      StaticStorages.AUTHORS_PICTURES
    );

    const createdAuthor = await this.authorsRepository.create(
      {
        userId,
        firstName,
        lastName,
        profilePicture: authorPicture,
        description
      },
      { transaction: trx }
    );

    return new AuthorCreatedDto(createdAuthor.id);
  }

  async createExperience({ payload, trx }: CreateExperienceInterface) {
    const {
      companyName,
      companyDescription,
      companyLink,
      companyLinkTitle,
      companyPicture,
      startDate,
      endDate,
      authorId
    } = payload;

    const experiencePicture = await this.uploadPicture(
      companyPicture,
      StaticStorages.EXPERIENCES_PICTURES
    );

    const createdExperience = await this.experiencesRepository.create(
      {
        companyName,
        companyDescription,
        companyLink,
        companyLinkTitle,
        companyPicture: experiencePicture,
        startDate,
        endDate,
        authorId
      },
      { transaction: trx }
    );

    return new ExperienceCreatedDto(createdExperience.id);
  }

  async updateExperience({ payload, trx }: UpdateExperienceInterface) {
    const {
      experienceId,
      companyDescription,
      companyLink,
      companyLinkTitle,
      companyPicture,
      companyName,
      startDate,
      endDate
    } = payload;

    const experience = await this.getExperienceById({ experienceId, trx });

    if (!experience) throw new ExperienceNotFoundException();

    const experienceUpdatedFields: Partial<Experience> = {};

    if (companyName) experienceUpdatedFields.companyName = companyName;
    if (companyDescription)
      experienceUpdatedFields.companyDescription = companyDescription;
    if (companyLink) experienceUpdatedFields.companyLink = companyLink;
    if (companyLinkTitle)
      experienceUpdatedFields.companyLinkTitle = companyLinkTitle;
    if (startDate) experienceUpdatedFields.startDate = startDate;
    if (endDate) experienceUpdatedFields.endDate = endDate;
    if (companyPicture) {
      await this.deletePicture(
        experience.companyPicture,
        StaticStorages.AUTHORS_PICTURES
      );
      experienceUpdatedFields.companyPicture = await this.uploadPicture(
        companyPicture,
        StaticStorages.AUTHORS_PICTURES
      );
    }

    await this.experiencesRepository.update(
      { ...experienceUpdatedFields },
      { where: { id: experienceId }, transaction: trx }
    );

    return new ExperienceUpdatedDto();
  }

  async updateAuthor({ payload, trx }: UpdateAuthorInterface) {
    const { authorId, firstName, lastName, profilePicture, description } =
      payload;

    const author = await this.getAuthorById({ authorId, trx });

    if (!author) throw new AuthorNotFoundException();

    const authorUpdatedFields: Partial<Author> = {};

    if (firstName) authorUpdatedFields.firstName = firstName;
    if (lastName) authorUpdatedFields.lastName = lastName;
    if (description) authorUpdatedFields.description = description;

    if (profilePicture) {
      await this.deletePicture(
        author.profilePicture,
        StaticStorages.AUTHORS_PICTURES
      );
      authorUpdatedFields.profilePicture = await this.uploadPicture(
        profilePicture,
        StaticStorages.AUTHORS_PICTURES
      );
    }

    await this.authorsRepository.update(
      { ...authorUpdatedFields },
      { where: { id: authorId }, transaction: trx }
    );

    return new AuthorUpdatedDto();
  }

  async deleteExperience({ experienceId, trx }: DeleteExperienceInterface) {
    const experience = await this.getExperienceById({ experienceId, trx });

    if (!experience) throw new ExperienceNotFoundException();

    await this.experiencesRepository.destroy({
      where: { id: experience.id },
      transaction: trx
    });

    return new ExperienceDeletedDto();
  }

  async deleteAuthor({ authorId, trx }: DeleteAuthorInterface) {
    const author = await this.getAuthorById({ authorId, trx });

    if (!author) throw new AuthorNotFoundException();

    await this.authorsRepository.destroy({
      where: { id: authorId },
      transaction: trx
    });

    return new AuthorDeletedDto();
  }

  async changeAuthorSelectionStatus({
    payload,
    trx
  }: UpdateAuthorSelectionStatusInterface) {
    const { authorId } = payload;

    const author = await this.getAuthorById({ authorId, trx });

    if (!author) throw new AuthorNotFoundException();

    const authorUpdatedStatus = !author.isSelected;

    await this.authorsRepository.update(
      {
        isSelected: !authorUpdatedStatus
      },
      { where: { id: authorId }, transaction: trx }
    );

    return new AuthorSelectionStatusUpdatedDto(authorUpdatedStatus);
  }

  private async uploadPicture(picture: string, folderName: string) {
    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    const base64Data = Buffer.from(
      picture.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    const type = picture.split(';')[0].split('/')[1];

    if (!['png', 'jpg', 'jpeg'].includes(type))
      throw new WrongPictureException();

    const pictureHash = this.cryptographicService.hash({
      data: base64Data.toString() + Date.now().toString(),
      algorithm: CryptoHashAlgorithm.MD5
    });

    const pictureName = `${pictureHash}.${type}`;

    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${pictureName}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };

    await s3.upload(params).promise();

    return pictureName;
  }

  private async deletePicture(picture: string, folderName: string) {
    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${picture}`
    };

    await s3.deleteObject(params).promise();
  }
}
