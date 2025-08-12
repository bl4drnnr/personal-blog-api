import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StaticAssetModel } from '@models/static-asset.model';
import { Op } from 'sequelize';
import { S3Service } from '@shared/s3.service';
import { StaticStorages } from '@interfaces/static-storages.enum';
import { ListStaticAssetsInterface } from '@interfaces/list-static-assets.interface';
import { UpdateStaticAssetInterface } from '@interfaces/update-static-asset.interface';
import { DeleteStaticAssetInterface } from '@interfaces/delete-static-asset.interface';
import { UploadStaticAssetInterface } from '@interfaces/upload-static-asset.interface';
import { AssetNotFoundException } from '@exceptions/asset-not-found.exception';

@Injectable()
export class StaticAssetsService {
  constructor(
    @InjectModel(StaticAssetModel)
    private readonly staticAssetModel: typeof StaticAssetModel,
    private readonly s3Service: S3Service
  ) {}

  async findAll(query: ListStaticAssetsInterface) {
    const { search, page, pageSize, orderBy, order, includePicture } = query;

    const offset = Number(page) * Number(pageSize);
    const limit = Number(pageSize);

    // Build where clause for search
    const whereClause: any = {};
    if (search && search.trim()) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search.trim()}%` } },
        { description: { [Op.iLike]: `%${search.trim()}%` } }
      ];
    }

    const includePictureBool = includePicture === 'true';
    // Filter out pictures if includePicture is false
    if (includePictureBool) {
      // Common image extensions
      const imageExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.webp',
        '.svg',
        '.ico'
      ];
      const imagePatterns = imageExtensions.map((ext) => `%${ext}`);

      whereClause.s3Url = {
        [Op.and]: imagePatterns.map((pattern) => ({
          [Op.notILike]: pattern
        }))
      };
    }

    const { rows, count } = await this.staticAssetModel.findAndCountAll({
      where: whereClause,
      order: [[orderBy, order]],
      limit,
      offset
    });

    return {
      assets: rows,
      total: count,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(count / Number(pageSize))
    };
  }

  async findById(id: string) {
    const asset = await this.staticAssetModel.findByPk(id);
    if (!asset) {
      throw new AssetNotFoundException();
    }
    return asset;
  }

  async update(payload: UpdateStaticAssetInterface) {
    const { data, trx } = payload;
    const id = data.id;
    const asset = await this.findById(id);
    return await asset.update(data, { transaction: trx });
  }

  async delete(payload: DeleteStaticAssetInterface) {
    const { id, trx } = payload;
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

  async uploadBase64Image(payload: UploadStaticAssetInterface) {
    const { base64File, name, description, trx } = payload;

    const fileName = await this.s3Service.uploadBase64Image({
      base64Image: base64File,
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

  async uploadFileFromBase64(payload: UploadStaticAssetInterface) {
    const { base64File, name, description, trx } = payload;

    // Determine if it's an image or other file type
    if (base64File.startsWith('data:image/')) {
      // Use the existing base64 image upload method
      return await this.uploadBase64Image({ base64File, name, description, trx });
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

  async getStaticAsset(assetId: string) {
    if (!assetId) {
      return null;
    }

    try {
      const asset = await this.findById(assetId);
      return asset.s3Url;
    } catch (error) {
      console.warn('Static asset not found:', assetId);
      return null;
    }
  }

  async getRandomAssetId() {
    const randomAsset = await this.staticAssetModel.findOne();
    return randomAsset.id;
  }
}
