/**
 * Development seeder: a database and a bucket you can actually work against.
 *
 * On top of the baseline it writes ~100 posts and ~40 assets, which is enough
 * for pagination, search, drafts and hero images to behave the way they will
 * with real content. Assets are uploaded through the same S3Service the API
 * uses, so keys, content types and the SVG hardening are identical to a real
 * upload — there is no separate code path to drift.
 *
 * Destructive by design: it truncates the content tables and empties its own
 * S3 prefix, so a run always leaves the same state.
 */
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { createS3Client, s3KeyPrefix, S3Service } from '@modules/assets/s3.service';
import * as schema from '@db/schema';
import {
  insertPosts,
  PostSeed,
  seedAbout,
  seedAdmin,
  seedSiteConfig,
  showcasePosts,
  truncateAll,
} from './baseline';
import { openDb, SeedDb } from './client';
import { mockAssets, mockPosts } from './mock-content';

const UPLOAD_CONCURRENCY = 8;

/** Empties the environment's own prefix so the bucket mirrors the database. */
async function purgePrefix(config: ConfigService, prefix: string): Promise<number> {
  const client = createS3Client(config);
  const bucket = config.getOrThrow<string>('S3_BUCKET');
  let removed = 0;
  let token: string | undefined;

  do {
    const page = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: `${prefix}/`, ContinuationToken: token }),
    );
    const keys = (page.Contents ?? []).map((object) => ({ Key: object.Key! }));
    if (keys.length > 0) {
      await client.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: keys } }));
      removed += keys.length;
    }
    token = page.NextContinuationToken;
  } while (token);

  return removed;
}

async function seedAssets(db: SeedDb, s3: S3Service): Promise<string[]> {
  const assets = mockAssets();
  const rows: (typeof schema.assets.$inferInsert)[] = [];

  for (let i = 0; i < assets.length; i += UPLOAD_CONCURRENCY) {
    const batch = assets.slice(i, i + UPLOAD_CONCURRENCY);
    const keys = await Promise.all(batch.map((a) => s3.upload(a.buffer, a.contentType)));
    batch.forEach((asset, j) => {
      rows.push({
        s3Key: keys[j],
        filename: asset.filename,
        contentType: asset.contentType,
        sizeBytes: asset.buffer.length,
        alt: asset.alt,
      });
    });
    process.stdout.write(`  uploaded ${Math.min(i + batch.length, assets.length)}/${assets.length}\r`);
  }

  const inserted = await db.insert(schema.assets).values(rows).returning({ id: schema.assets.id });
  process.stdout.write('\n');
  return inserted.map((row) => row.id);
}

/**
 * The frontend caches API responses on disk against tags, for an hour. Seeding
 * writes straight to the database, so nothing invalidates them and the site
 * keeps serving the previous content — including across a restart, which is a
 * confusing thing to debug. Best effort: a front that is not running yet is not
 * a failed seed, but it does need saying out loud.
 */
async function revalidateFront(config: ConfigService): Promise<void> {
  const frontUrl = config.getOrThrow<string>('FRONT_INTERNAL_URL');
  const tags = ['posts', 'config', 'about'];

  try {
    const res = await fetch(`${frontUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: config.getOrThrow<string>('REVALIDATE_SECRET'), tags }),
    });
    console.log(
      res.ok
        ? `  front:    cache flushed (${tags.join(', ')})`
        : `  front:    ${frontUrl} returned ${res.status} — cache NOT flushed`,
    );
  } catch {
    console.log(`  front:    not running at ${frontUrl}, so its cache still holds the old content`);
    console.log('            start it and re-run this, or delete personal-blog-front/.next/cache');
  }
}

/** Give the posts that are actually shown as cards a picture to show. */
function withHeroImages(posts: PostSeed[], assetIds: string[]): PostSeed[] {
  return posts.map((post, i) =>
    post.published && i % 3 === 0 ? { ...post, heroAssetId: assetIds[i % assetIds.length] } : post,
  );
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('dev-seed truncates tables and empties an S3 prefix; refusing to run in production');
  }

  const config = new ConfigService();
  const prefix = s3KeyPrefix(config);
  const bucket = config.getOrThrow<string>('S3_BUCKET');
  const { db, pool } = openDb();

  console.log(`Seeding ${new URL(process.env.DATABASE_URL!).host} and s3://${bucket}/${prefix}/\n`);

  await truncateAll(db);
  const removed = await purgePrefix(config, prefix);
  console.log(`Cleared database content and ${removed} object(s) under ${prefix}/.`);

  const admin = await seedAdmin(db);
  await seedSiteConfig(db);
  await seedAbout(db);

  const assetIds = await seedAssets(db, new S3Service(config));
  const posts = withHeroImages([...showcasePosts(), ...mockPosts()], assetIds);
  await insertPosts(db, posts);

  await pool.end();

  const articles = posts.filter((p) => p.type === 'article');
  const projects = posts.filter((p) => p.type === 'project');
  const drafts = posts.filter((p) => !p.published);

  console.log('\nDev seed complete.');
  console.log(`  posts:    ${posts.length} (${articles.length} articles, ${projects.length} projects, ${drafts.length} drafts)`);
  console.log(`  assets:   ${assetIds.length} uploaded to s3://${bucket}/${prefix}/`);
  console.log(`  admin:    ${admin.email} / ${admin.password}`);
  console.log('  MFA:      not enrolled — the admin panel walks through TOTP setup on first login.');
  await revalidateFront(config);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
