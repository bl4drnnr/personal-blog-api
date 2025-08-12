import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ApiConfigService } from './config.service';
import { CryptographicService } from './cryptographic.service';
import { CryptoHashAlgorithm } from '@interfaces/crypto-hash-algorithm.enum';
import { StaticStorages } from '@interfaces/static-storages.enum';
import { InvalidFormatException } from '@exceptions/invalid-format.exception';

export interface UploadFileInterface {
  file: Express.Multer.File;
  folderName: StaticStorages;
}

export interface UploadBase64ImageInterface {
  base64Image: string;
  folderName: StaticStorages;
}

export interface DeleteFileInterface {
  fileName: string;
  folderName: StaticStorages;
}

export interface UploadBase64FileInterface {
  base64File: string;
  folderName: StaticStorages;
}

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(
    private readonly configService: ApiConfigService,
    private readonly cryptographicService: CryptographicService
  ) {
    const { accessKeyId, secretAccessKey } = this.configService.awsSdkCredentials;
    this.s3 = new S3({ accessKeyId, secretAccessKey });
  }

  async uploadFile({ file, folderName }: UploadFileInterface): Promise<string> {
    const { bucketName } = this.configService.awsSdkCredentials;

    const fileHash = this.cryptographicService.hash({
      data: file.originalname + Date.now().toString(),
      algorithm: CryptoHashAlgorithm.MD5
    });

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${fileHash}.${fileExtension}`;

    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    await this.s3.upload(params).promise();
    return fileName;
  }

  async uploadBase64Image({
    base64Image,
    folderName
  }: UploadBase64ImageInterface): Promise<string> {
    const { bucketName } = this.configService.awsSdkCredentials;

    // Validate image format
    const type = base64Image.split(';')[0].split('/')[1];
    if (!['png', 'jpg', 'jpeg', 'svg+xml'].includes(type)) {
      throw new InvalidFormatException();
    }

    const base64Data = Buffer.from(
      base64Image.replace(/^data:image\/[\w+\-]+;base64,/, ''),
      'base64'
    );

    const imageHash = this.cryptographicService.hash({
      data: base64Data.toString() + Date.now().toString(),
      algorithm: CryptoHashAlgorithm.MD5
    });

    const fileExtension = type === 'svg+xml' ? 'svg' : type;
    const fileName = `${imageHash}.${fileExtension}`;

    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${fileName}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };

    await this.s3.upload(params).promise();
    return fileName;
  }

  async deleteFile({ fileName, folderName }: DeleteFileInterface): Promise<void> {
    const { bucketName } = this.configService.awsSdkCredentials;

    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${fileName}`
    };

    await this.s3.deleteObject(params).promise();
  }

  async uploadBase64File({
    base64File,
    folderName
  }: UploadBase64FileInterface): Promise<string> {
    const { bucketName } = this.configService.awsSdkCredentials;

    // Extract MIME type and data from base64 string
    const matches = base64File.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new InvalidFormatException();
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate file extension from MIME type
    const extension = this.getExtensionFromMimeType(mimeType);

    const fileHash = this.cryptographicService.hash({
      data: base64Data + Date.now().toString(),
      algorithm: CryptoHashAlgorithm.MD5
    });

    const fileName = `${fileHash}.${extension}`;

    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${fileName}`,
      Body: buffer,
      ContentType: mimeType
    };

    await this.s3.upload(params).promise();
    return fileName;
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: { [key: string]: string } = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'text/plain': 'txt',
      'application/json': 'json',
      'text/html': 'html',
      'text/css': 'css',
      'application/javascript': 'js',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav'
    };

    return mimeToExt[mimeType] || 'bin';
  }

  getFileUrl(fileName: string, folderName: StaticStorages): string {
    const { bucketUrl } = this.configService.awsSdkCredentials;
    return `${bucketUrl}/${folderName}/${fileName}`;
  }
}
