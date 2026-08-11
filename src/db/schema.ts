import { SQL, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  customType,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

export const postType = pgEnum('post_type', ['article', 'project']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  mfaSecret: text('mfa_secret'),
  mfaEnabled: boolean('mfa_enabled').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  refreshJtiHash: text('refresh_jti_hash').notNull(),
  // The jti this one replaced, honoured for a few seconds after rotation. Two
  // browser tabs share one cookie, so they can present the same refresh token
  // at the same moment; without this the loser looks exactly like a replay and
  // the whole session gets revoked. See tokens.service.ts.
  previousJtiHash: text('previous_jti_hash'),
  previousExpiresAt: timestamp('previous_expires_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  s3Key: text('s3_key').notNull().unique(),
  // The name the file was uploaded under. Kept for display and search only —
  // the object key is derived from the content hash and MIME type, never from
  // this, so a hostile filename cannot steer where the object lands.
  filename: text('filename').notNull().default(''),
  contentType: text('content_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  alt: text('alt'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: postType('type').notNull(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull().default(''),
    contentMd: text('content_md').notNull().default(''),
    // Search-only projection of contentMd (+ tags), recomputed by the API on save.
    // Kept out of the generated column so the tsvector expression stays IMMUTABLE.
    plainText: text('plain_text').notNull().default(''),
    tags: text('tags')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    featured: boolean('featured').notNull().default(false),
    published: boolean('published').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    readingTimeMin: integer('reading_time_min').notNull().default(1),
    heroAssetId: uuid('hero_asset_id').references(() => assets.id, { onDelete: 'set null' }),
    repoUrl: text('repo_url'),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    search: tsvector('search').generatedAlwaysAs(
      (): SQL =>
        sql`setweight(to_tsvector('english', ${posts.title}), 'A') || setweight(to_tsvector('english', ${posts.excerpt}), 'B') || setweight(to_tsvector('english', ${posts.plainText}), 'C')`,
    ),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('posts_search_idx').using('gin', t.search),
    index('posts_listing_idx').on(t.type, t.published, t.publishedAt.desc()),
  ],
);

export const siteConfig = pgTable(
  'site_config',
  {
    id: integer('id').primaryKey().default(1),
    heroTitle: text('hero_title').notNull().default(''),
    heroIntroMd: text('hero_intro_md').notNull().default(''),
    socialLinks: jsonb('social_links')
      .$type<{ label: string; url: string }[]>()
      .notNull()
      .default([]),
    seoDefaultTitle: text('seo_default_title').notNull().default(''),
    seoDefaultDescription: text('seo_default_description').notNull().default(''),
    footerText: text('footer_text').notNull().default(''),
    // Deploy-time switch, not content: served via /maintenance, never /config.
    maintenance: boolean('maintenance').notNull().default(false),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check('site_config_singleton', sql`${t.id} = 1`)],
);

export const about = pgTable(
  'about',
  {
    id: integer('id').primaryKey().default(1),
    fullName: text('full_name').notNull().default(''),
    avatarAssetId: uuid('avatar_asset_id').references(() => assets.id, { onDelete: 'set null' }),
    profileMd: text('profile_md').notNull().default(''),
    location: text('location').notNull().default(''),
    contactEmail: text('contact_email').notNull().default(''),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check('about_singleton', sql`${t.id} = 1`)],
);

export const positions = pgTable('positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  company: text('company').notNull(),
  companyUrl: text('company_url'),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  location: text('location').notNull().default(''),
  logoAssetId: uuid('logo_asset_id').references(() => assets.id, { onDelete: 'set null' }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  bullets: text('bullets')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  skills: text('skills')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const education = pgTable('education', {
  id: uuid('id').primaryKey().defaultRandom(),
  institution: text('institution').notNull(),
  degree: text('degree').notNull(),
  field: text('field').notNull().default(''),
  location: text('location').notNull().default(''),
  logoAssetId: uuid('logo_asset_id').references(() => assets.id, { onDelete: 'set null' }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  notes: text('notes').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const certifications = pgTable('certifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  issuer: text('issuer').notNull(),
  description: text('description').notNull().default(''),
  logoAssetId: uuid('logo_asset_id').references(() => assets.id, { onDelete: 'set null' }),
  issuedDate: date('issued_date').notNull(),
  expiresDate: date('expires_date'),
  credentialUrl: text('credential_url'),
  sortOrder: integer('sort_order').notNull().default(0),
});
