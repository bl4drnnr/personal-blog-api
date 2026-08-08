import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { desc, eq, ilike, sql } from 'drizzle-orm';
import { Database, DRIZZLE } from '@db/db.module';
import { assets } from '@db/schema';
import { S3Service } from './s3.service';

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
    const key = await this.s3.upload(file.buffer, file.mimetype, file.originalname);

    const [existing] = await this.db.select().from(assets).where(eq(assets.s3Key, key));
    if (existing) {
      // Same bytes + extension hash to the same key — reuse the row.
      return this.withUrl(existing);
    }

    const [created] = await this.db
      .insert(assets)
      .values({
        s3Key: key,
        contentType: file.mimetype,
        sizeBytes: file.size,
        alt: alt ?? null,
      })
      .returning();
    return this.withUrl(created);
  }

  async list(search: string | undefined, page: number, per: number) {
    const where = search ? ilike(assets.s3Key, `%${search}%`) : undefined;

    const [{ total }] = await this.db
      .select({ total: sql<number>`count(*)::int` })
      .from(assets)
      .where(where);

    const items = await this.db
      .select()
      .from(assets)
      .where(where)
      .orderBy(desc(assets.createdAt))
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
