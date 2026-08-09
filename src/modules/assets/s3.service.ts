import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { EXTENSION_BY_MIME, SVG_MIME } from './mime';

/**
 * Explicit keys where the runtime has no other source of them (the production
 * container, CI). Omitting both hands the SDK its default chain — an EC2
 * instance role, or `~/.aws/credentials` on a developer's machine — which is
 * how a dev box points at the real bucket without a second copy of a live key
 * sitting in a repo-local file. Half a pair is always a mistake, so it throws.
 */
function credentials(config: ConfigService) {
  const accessKeyId = config.get<string>('S3_ACCESS_KEY_ID');
  const secretAccessKey = config.get<string>('S3_SECRET_ACCESS_KEY');
  if (!accessKeyId && !secretAccessKey) {
    return {};
  }
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      'S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be set together, or both left unset',
    );
  }
  return { credentials: { accessKeyId, secretAccessKey } };
}

/** Shared with the dev seeder, so both reach the bucket the same way. */
export function createS3Client(config: ConfigService): S3Client {
  // S3_ENDPOINT is only set for S3-compatible storage (MinIO in dev); real AWS
  // resolves its endpoint from the region and needs virtual-hosted style.
  const endpoint = config.get<string>('S3_ENDPOINT');
  return new S3Client({
    region: config.getOrThrow<string>('S3_REGION'),
    ...credentials(config),
    ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
  });
}

export function s3KeyPrefix(config: ConfigService): string {
  return config.getOrThrow<string>('S3_KEY_PREFIX').replace(/^\/+|\/+$/g, '');
}

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly keyPrefix: string;

  constructor(config: ConfigService) {
    this.bucket = config.getOrThrow<string>('S3_BUCKET');
    // Every environment writes under its own prefix, so one bucket can hold dev
    // and production objects without either being able to overwrite or delete
    // the other's — keys are content hashes, which would otherwise collide
    // across environments for identical files.
    this.keyPrefix = s3KeyPrefix(config);
    this.client = createS3Client(config);
  }

  async upload(buffer: Buffer, contentType: string): Promise<string> {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 16);
    const key = `${this.keyPrefix}/${year}/${month}/${hash}${EXTENSION_BY_MIME[contentType]}`;

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
