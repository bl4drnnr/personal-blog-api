import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StaticAssetModel } from '@models/static-asset.model';
import { CreateStaticAssetDto } from '@dto/static-assets/requests/create-static-asset.dto';
import { UpdateStaticAssetDto } from '@dto/static-assets/requests/update-static-asset.dto';
import { Transaction } from 'sequelize';
import { S3Service } from '@shared/s3.service';
import { StaticStorages } from '@interfaces/static-storages.enum';

@Injectable()
export class StaticAssetsService {
  constructor(
    @InjectModel(StaticAssetModel)
    private readonly staticAssetModel: typeof StaticAssetModel,
    private readonly s3Service: S3Service
  ) {}

  async findAll() {
    return await this.staticAssetModel.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async findById(id: string) {
    const asset = await this.staticAssetModel.findByPk(id);
    if (!asset) {
      throw new Error('Static asset not found');
    }
    return asset;
  }

  async create(data: CreateStaticAssetDto, trx?: Transaction) {
    return await this.staticAssetModel.create(data, { transaction: trx });
  }

  async update(id: string, data: UpdateStaticAssetDto, trx?: Transaction) {
    const asset = await this.findById(id);
    return await asset.update(data, { transaction: trx });
  }

  async delete(id: string, trx?: Transaction) {
    const asset = await this.findById(id);

    // Extract filename from S3 URL
    const fileName = asset.s3Url.split('/').pop();
    if (fileName) {
      await this.s3Service.deleteFile({
        fileName,
        folderName: StaticStorages.STATIC_ASSETS
      });
    }

    await asset.destroy({ transaction: trx });
    return { message: 'Static asset deleted successfully' };
  }

  async findByName(name: string) {
    return await this.staticAssetModel.findOne({
      where: { name }
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    name: string,
    description?: string,
    trx?: Transaction
  ) {
    const fileName = await this.s3Service.uploadFile({
      file,
      folderName: StaticStorages.STATIC_ASSETS
    });

    const s3Url = this.s3Service.getFileUrl(fileName, StaticStorages.STATIC_ASSETS);

    return await this.staticAssetModel.create(
      {
        name,
        s3Url,
        description
      },
      { transaction: trx }
    );
  }

  async uploadBase64Image(
    base64Image: string,
    name: string,
    description?: string,
    trx?: Transaction
  ) {
    const fileName = await this.s3Service.uploadBase64Image({
      base64Image,
      folderName: StaticStorages.STATIC_ASSETS
    });

    const s3Url = this.s3Service.getFileUrl(fileName, StaticStorages.STATIC_ASSETS);

    return await this.staticAssetModel.create(
      {
        name,
        s3Url,
        description
      },
      { transaction: trx }
    );
  }

  async uploadFileFromBase64(
    base64File: string,
    name: string,
    description?: string,
    trx?: Transaction
  ) {
    // Determine if it's an image or other file type
    if (base64File.startsWith('data:image/')) {
      // Use the existing base64 image upload method
      return await this.uploadBase64Image(base64File, name, description, trx);
    } else {
      // For non-image files, use a generic base64 file upload
      const fileName = await this.s3Service.uploadBase64File({
        base64File,
        folderName: StaticStorages.STATIC_ASSETS
      });

      const s3Url = this.s3Service.getFileUrl(
        fileName,
        StaticStorages.STATIC_ASSETS
      );

      return await this.staticAssetModel.create(
        {
          name,
          s3Url,
          description
        },
        { transaction: trx }
      );
    }
  }

  async updateFile(
    id: string,
    file: Express.Multer.File,
    data: UpdateStaticAssetDto,
    trx?: Transaction
  ) {
    const asset = await this.findById(id);

    // Delete old file if exists
    const oldFileName = asset.s3Url.split('/').pop();
    if (oldFileName) {
      await this.s3Service.deleteFile({
        fileName: oldFileName,
        folderName: StaticStorages.STATIC_ASSETS
      });
    }

    // Upload new file
    const fileName = await this.s3Service.uploadFile({
      file,
      folderName: StaticStorages.STATIC_ASSETS
    });

    const s3Url = this.s3Service.getFileUrl(fileName, StaticStorages.STATIC_ASSETS);

    return await asset.update(
      {
        ...data,
        s3Url
      },
      { transaction: trx }
    );
  }

  async updateFileFromBase64(
    id: string,
    base64File: string,
    data: UpdateStaticAssetDto,
    trx?: Transaction
  ) {
    const asset = await this.findById(id);

    // Delete old file if exists
    const oldFileName = asset.s3Url.split('/').pop();
    if (oldFileName) {
      await this.s3Service.deleteFile({
        fileName: oldFileName,
        folderName: StaticStorages.STATIC_ASSETS
      });
    }

    let fileName: string;

    // Determine if it's an image or other file type
    if (base64File.startsWith('data:image/')) {
      fileName = await this.s3Service.uploadBase64Image({
        base64Image: base64File,
        folderName: StaticStorages.STATIC_ASSETS
      });
    } else {
      fileName = await this.s3Service.uploadBase64File({
        base64File,
        folderName: StaticStorages.STATIC_ASSETS
      });
    }

    const s3Url = this.s3Service.getFileUrl(fileName, StaticStorages.STATIC_ASSETS);

    return await asset.update(
      {
        ...data,
        s3Url
      },
      { transaction: trx }
    );
  }
}
