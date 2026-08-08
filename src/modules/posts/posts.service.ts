import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { and, desc, eq, ilike, sql, SQL } from 'drizzle-orm';
import { markdownToPlainText, readingTimeMin } from '../../common/content';
import { Database, DRIZZLE } from '../../db/db.module';
import { assets, posts } from '../../db/schema';
import { RevalidateService } from '../revalidate/revalidate.service';
import {
  AdminListPostsQueryDto,
  CreatePostDto,
  ListPostsQueryDto,
  UpdatePostDto,
} from './dto/posts.dto';

@Injectable()
export class PostsService {
  private readonly s3PublicUrl: string;

  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly revalidate: RevalidateService,
    config: ConfigService,
  ) {
    this.s3PublicUrl = config.getOrThrow<string>('S3_PUBLIC_URL');
  }

  private heroUrl(s3Key: string | null): string | null {
    return s3Key ? `${this.s3PublicUrl}/${s3Key}` : null;
  }

  async listPublic(query: ListPostsQueryDto) {
    const conditions: SQL[] = [eq(posts.published, true)];
    if (query.type) {
      conditions.push(eq(posts.type, query.type));
    }
    if (query.featured !== undefined) {
      conditions.push(eq(posts.featured, query.featured));
    }
    const where = and(...conditions);

    const [{ total }] = await this.db
      .select({ total: sql<number>`count(*)::int` })
      .from(posts)
      .where(where);

    const items = await this.db
      .select({
        slug: posts.slug,
        type: posts.type,
        title: posts.title,
        excerpt: posts.excerpt,
        tags: posts.tags,
        publishedAt: posts.publishedAt,
        readingTimeMin: posts.readingTimeMin,
        repoUrl: posts.repoUrl,
        heroKey: assets.s3Key,
      })
      .from(posts)
      .leftJoin(assets, eq(posts.heroAssetId, assets.id))
      .where(where)
      .orderBy(desc(posts.publishedAt))
      .limit(query.per)
      .offset((query.page - 1) * query.per);

    return {
      items: items.map(({ heroKey, ...item }) => ({ ...item, heroUrl: this.heroUrl(heroKey) })),
      total,
      page: query.page,
      per: query.per,
    };
  }

  async getPublicBySlug(slug: string) {
    const [row] = await this.db
      .select({
        slug: posts.slug,
        type: posts.type,
        title: posts.title,
        excerpt: posts.excerpt,
        contentMd: posts.contentMd,
        tags: posts.tags,
        publishedAt: posts.publishedAt,
        updatedAt: posts.updatedAt,
        readingTimeMin: posts.readingTimeMin,
        repoUrl: posts.repoUrl,
        seoTitle: posts.seoTitle,
        seoDescription: posts.seoDescription,
        heroKey: assets.s3Key,
      })
      .from(posts)
      .leftJoin(assets, eq(posts.heroAssetId, assets.id))
      .where(and(eq(posts.slug, slug), eq(posts.published, true)));

    if (!row) {
      throw new NotFoundException();
    }
    const { heroKey, ...post } = row;
    return { ...post, heroUrl: this.heroUrl(heroKey) };
  }

  async listPublishedSlugs() {
    return this.db
      .select({ slug: posts.slug, type: posts.type, updatedAt: posts.updatedAt })
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.publishedAt));
  }

  // --- admin ----------------------------------------------------------------

  async listAdmin(query: AdminListPostsQueryDto) {
    const conditions: SQL[] = [];
    if (query.type) {
      conditions.push(eq(posts.type, query.type));
    }
    if (query.search) {
      conditions.push(ilike(posts.title, `%${query.search}%`));
    }
    const where = conditions.length ? and(...conditions) : undefined;

    const [{ total }] = await this.db
      .select({ total: sql<number>`count(*)::int` })
      .from(posts)
      .where(where);

    const items = await this.db
      .select({
        id: posts.id,
        slug: posts.slug,
        type: posts.type,
        title: posts.title,
        featured: posts.featured,
        published: posts.published,
        publishedAt: posts.publishedAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(where)
      .orderBy(desc(posts.updatedAt))
      .limit(query.per)
      .offset((query.page - 1) * query.per);

    return { items, total, page: query.page, per: query.per };
  }

  async getAdminById(id: string) {
    const [post] = await this.db.select().from(posts).where(eq(posts.id, id));
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async create(dto: CreatePostDto) {
    await this.assertSlugFree(dto.slug);

    const [created] = await this.db
      .insert(posts)
      .values({
        ...dto,
        plainText: markdownToPlainText(dto.contentMd, dto.tags),
        readingTimeMin: readingTimeMin(dto.contentMd),
        publishedAt: dto.published ? new Date() : null,
      })
      .returning();

    this.revalidate.notify(['posts', `post:${created.slug}`]);
    return created;
  }

  async update(id: string, dto: UpdatePostDto) {
    const existing = await this.getAdminById(id);
    if (dto.slug !== existing.slug) {
      await this.assertSlugFree(dto.slug);
    }

    const [updated] = await this.db
      .update(posts)
      .set({
        ...dto,
        // repoUrl/heroAssetId/seo fields absent in the payload mean "cleared"
        repoUrl: dto.repoUrl ?? null,
        heroAssetId: dto.heroAssetId ?? null,
        seoTitle: dto.seoTitle ?? null,
        seoDescription: dto.seoDescription ?? null,
        plainText: markdownToPlainText(dto.contentMd, dto.tags),
        readingTimeMin: readingTimeMin(dto.contentMd),
        // published_at is stamped exactly once, on the first transition to published
        publishedAt: dto.published && !existing.publishedAt ? new Date() : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    const tags = ['posts', `post:${updated.slug}`];
    if (existing.slug !== updated.slug) {
      tags.push(`post:${existing.slug}`);
    }
    this.revalidate.notify(tags);
    return updated;
  }

  async remove(id: string) {
    const existing = await this.getAdminById(id);
    await this.db.delete(posts).where(eq(posts.id, id));
    this.revalidate.notify(['posts', `post:${existing.slug}`]);
  }

  private async assertSlugFree(slug: string) {
    const [clash] = await this.db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug));
    if (clash) {
      throw new ConflictException(`Slug '${slug}' is already in use`);
    }
  }
}
