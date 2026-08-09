import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { EXTENSION_BY_MIME, SVG_MIME } from './mime';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: ConfigService) {
    this.bucket = config.getOrThrow<string>('S3_BUCKET');
    // S3_ENDPOINT is only set for S3-compatible storage (MinIO in dev); real AWS
    // resolves its endpoint from the region and needs virtual-hosted style.
    const endpoint = config.get<string>('S3_ENDPOINT');
    this.client = new S3Client({
      region: config.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: config.getOrThrow<string>('S3_ACCESS_KEY_ID'),
        secretAccessKey: config.getOrThrow<string>('S3_SECRET_ACCESS_KEY'),
      },
      ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    });
  }

  async upload(buffer: Buffer, contentType: string): Promise<string> {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 16);
    const key = `uploads/${year}/${month}/${hash}${EXTENSION_BY_MIME[contentType]}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
        // An SVG opened as a top-level document runs its own scripts against the
        // bucket's origin. <img>/<image> rendering ignores this header, so
        // forcing a download costs nothing and removes that path.
        ...(contentType === SVG_MIME ? { ContentDisposition: 'attachment' } : {}),
      }),
    );
    return key;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
