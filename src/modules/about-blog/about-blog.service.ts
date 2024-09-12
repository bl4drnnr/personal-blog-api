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

  getAuthorById({ authorId, trx }: GetAuthorByIdInterface) {
    return this.authorsRepository.findByPk(authorId, { transaction: trx });
  }

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

  async createAuthor({ userId, payload, trx }: CreateAuthorInterface) {
    const { firstName, lastName, profilePicture, description } = payload;

    const authorPicture = await this.uploadAuthorPicture(profilePicture);

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
      await this.deleteAuthorPicture(author.profilePicture);
      authorUpdatedFields.profilePicture =
        await this.uploadAuthorPicture(profilePicture);
    }

    await this.authorsRepository.update(
      { ...authorUpdatedFields },
      { where: { id: authorId }, transaction: trx }
    );

    return new AuthorUpdatedDto();
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

  private async uploadAuthorPicture(picture: string) {
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
      Key: `authors-pictures/${pictureName}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };

    await s3.upload(params).promise();

    return pictureName;
  }

  private async deleteAuthorPicture(picture: string) {
    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    const params = {
      Bucket: bucketName,
      Key: `authors-pictures/${picture}`
    };

    await s3.deleteObject(params).promise();
  }
}
