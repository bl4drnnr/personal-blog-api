import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { desc, eq, ilike, or, sql, SQL } from 'drizzle-orm';
import { Database, DRIZZLE } from '@db/db.module';
import { assets } from '@db/schema';
import { S3Service } from './s3.service';

/**
 * Display-only, so this just has to be sane text: no control characters, no
 * path, bounded length.
 *
 * Multipart filenames arrive latin1-decoded, which turns a UTF-8 name like
 * 'ünïcode.png' into 'Ã¼nÃ¯code.png'. Reading those bytes back as UTF-8 undoes
 * it; a name that was genuinely latin1 decodes to U+FFFD, so keep the original.
 */
function sanitizeFilename(originalName: string): string {
  const reinterpreted = Buffer.from(originalName, 'latin1').toString('utf8');
  const decoded = reinterpreted.includes('�') ? originalName : reinterpreted;
  const base = decoded.split(/[/\\]/).pop() ?? '';
  return Array.from(base)
    .filter((char) => char.codePointAt(0)! > 0x1f)
    .join('')
    .trim()
    .slice(0, 200);
}

@Injectable()
export class AssetsService {
  private readonly publicUrl: string;

  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly s3: S3Service,
    config: ConfigService,
  ) {
    this.publicUrl = config.getOrThrow<string>('S3_PUBLIC_URL');
  }

  private withUrl<T extends { s3Key: string }>(asset: T): T & { url: string } {
    return { ...asset, url: `${this.publicUrl}/${asset.s3Key}` };
  }

  async upload(file: Express.Multer.File, alt: string | undefined) {
    const key = await this.s3.upload(file.buffer, file.mimetype);

    const [existing] = await this.db.select().from(assets).where(eq(assets.s3Key, key));
    if (existing) {
      // Same bytes + extension hash to the same key — reuse the row.
      return this.withUrl(existing);
    }

    const [created] = await this.db
      .insert(assets)
      .values({
        s3Key: key,
        filename: sanitizeFilename(file.originalname),
        contentType: file.mimetype,
        sizeBytes: file.size,
        alt: alt ?? null,
      })
      .returning();
    return this.withUrl(created);
  }

  async list(search: string | undefined, page: number, per: number) {
    // Match what the admin actually shows: the upload name and alt text. The
    // key is a content hash, so searching it alone was never useful.
    const term = search?.trim();
    const where: SQL | undefined = term
      ? or(
          ilike(assets.filename, `%${term}%`),
          ilike(assets.alt, `%${term}%`),
          ilike(assets.s3Key, `%${term}%`),
        )
      : undefined;

    const [{ total }] = await this.db
      .select({ total: sql<number>`count(*)::int` })
      .from(assets)
      .where(where);

    const items = await this.db
      .select()
      .from(assets)
      .where(where)
      // Same reasoning as the post listings: a bulk upload shares a timestamp,
      // and without a total order paging over it can drop rows.
      .orderBy(desc(assets.createdAt), desc(assets.id))
      .limit(per)
      .offset((page - 1) * per);

    return { items: items.map((a) => this.withUrl(a)), total, page, per };
  }

  async remove(id: string) {
    const [asset] = await this.db.select().from(assets).where(eq(assets.id, id));
    if (!asset) {
      throw new NotFoundException();
    }
    await this.s3.delete(asset.s3Key);
    await this.db.delete(assets).where(eq(assets.id, id));
  }
}
