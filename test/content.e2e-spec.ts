import { eq } from 'drizzle-orm';
import request from 'supertest';
import { certifications, positions } from '@db/schema';
import { createTestApp, TestApp } from './app.harness';
import { createAuthedUser, deleteUser } from './auth-helper';

const USER_EMAIL = 'e2e-content@test.local';
const COMPANY = 'E2E Test Company';

// 1x1 transparent PNG
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
);

// Objects land under the environment's own prefix, so the expected key shape is
// derived from the same setting the service reads rather than hardcoded.
const KEY_PREFIX = process.env.S3_KEY_PREFIX!.replace(/^\/+|\/+$/g, '');
const KEY_PATTERN = `${KEY_PREFIX}\\/\\d{4}\\/\\d{2}\\/[0-9a-f]{16}\\.png$`;

describe('Assets, About, Config (e2e)', () => {
  let ctx: TestApp;
  let server: ReturnType<TestApp['app']['getHttpServer']>;
  let token: string;

  beforeAll(async () => {
    ctx = await createTestApp();
    server = ctx.app.getHttpServer();
    token = await createAuthedUser(ctx, USER_EMAIL);
    await ctx.db.delete(positions).where(eq(positions.company, COMPANY));
  });

  afterAll(async () => {
    await ctx.db.delete(positions).where(eq(positions.company, COMPANY));
    await deleteUser(ctx, USER_EMAIL);
    await ctx.app.close();
  });

  describe('assets', () => {
    let assetId: string;

    it('uploads a PNG to object storage', async () => {
      const res = await request(server)
        .post('/api/admin/assets')
        .set('Authorization', `Bearer ${token}`)
        .field('alt', 'A test pixel')
        .attach('file', PNG, { filename: 'pixel.png', contentType: 'image/png' })
        .expect(201);
      assetId = res.body.id;
      expect(res.body.url).toMatch(new RegExp(`^http.*\\/${KEY_PATTERN}`));
      expect(res.body.alt).toBe('A test pixel');

      // The object must actually be retrievable from storage.
      const stored = await fetch(res.body.url);
      expect(stored.status).toBe(200);
      expect(Buffer.from(await stored.arrayBuffer()).equals(PNG)).toBe(true);
    });

    it('rejects non-image uploads', async () => {
      await request(server)
        .post('/api/admin/assets')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('#!/bin/sh\necho pwned'), {
          filename: 'script.sh',
          contentType: 'application/x-sh',
        })
        .expect(400);
    });

    it('keeps the upload name for display, without letting it steer the key', async () => {
      const res = await request(server)
        .post('/api/admin/assets')
        .set('Authorization', `Bearer ${token}`)
        .field('alt', 'traversal probe')
        .attach('file', Buffer.concat([PNG, Buffer.from([1])]), {
          filename: '../../etc/Ünicode Name.png',
          contentType: 'image/png',
        })
        .expect(201);

      // Path stripped, UTF-8 preserved, extension still derived from the type.
      expect(res.body.filename).toBe('Ünicode Name.png');
      expect(res.body.s3Key).toMatch(new RegExp(`^${KEY_PATTERN}`));

      // ILIKE is a plain substring match, so search an ASCII run of the name —
      // 'Ünicode' lowercases to 'ünicode' and would not match 'unicode'.
      const byName = await request(server)
        .get('/api/admin/assets')
        .query({ search: 'nicode Name' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(byName.body.items.map((a: { id: string }) => a.id)).toContain(res.body.id);

      const byAlt = await request(server)
        .get('/api/admin/assets')
        .query({ search: 'traversal' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(byAlt.body.items.map((a: { id: string }) => a.id)).toContain(res.body.id);

      const page = await request(server)
        .get('/api/admin/assets')
        .query({ page: 1, per: 1 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(page.body.items).toHaveLength(1);
      expect(page.body.per).toBe(1);
      expect(page.body.total).toBeGreaterThan(1);

      await request(server)
        .delete(`/api/admin/assets/${res.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('lists and deletes assets', async () => {
      const list = await request(server)
        .get('/api/admin/assets')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(list.body.items.map((a: { id: string }) => a.id)).toContain(assetId);

      await request(server)
        .delete(`/api/admin/assets/${assetId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });
  });

  describe('about', () => {
    it('updates the profile and serves it publicly', async () => {
      await request(server)
        .put('/api/admin/about')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'E2E Person',
          profileMd: 'A profile written by the e2e suite.',
          location: 'Testville',
          contactEmail: 'e2e@test.local',
        })
        .expect(200);

      const pub = await request(server).get('/api/about').expect(200);
      expect(pub.body.fullName).toBe('E2E Person');
      expect(pub.body.avatarUrl).toBeNull();
      expect(Array.isArray(pub.body.positions)).toBe(true);
    });

    it('runs a position through create/update/delete', async () => {
      const base = {
        company: COMPANY,
        title: 'Engineer',
        description: 'Doing e2e things.',
        location: 'Remote',
        startDate: '2024-01-01',
        bullets: ['Did a thing', 'Did another thing'],
        skills: ['testing'],
        sortOrder: 99,
      };
      const created = await request(server)
        .post('/api/admin/positions')
        .set('Authorization', `Bearer ${token}`)
        .send(base)
        .expect(201);

      const updated = await request(server)
        .put(`/api/admin/positions/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...base, title: 'Senior Engineer', endDate: '2026-01-01' })
        .expect(200);
      expect(updated.body.title).toBe('Senior Engineer');
      expect(updated.body.endDate).toBe('2026-01-01');

      const pub = await request(server).get('/api/about').expect(200);
      const mine = pub.body.positions.find((p: { company: string }) => p.company === COMPANY);
      expect(mine.title).toBe('Senior Engineer');
      expect(mine.logoUrl).toBeNull();
      expect(mine.logoAssetId).toBeUndefined();

      await request(server)
        .delete(`/api/admin/positions/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('validates certification payloads', async () => {
      await request(server)
        .post('/api/admin/certifications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Broken',
          issuer: 'Nobody',
          description: '',
          issuedDate: 'not-a-date',
          sortOrder: 0,
        })
        .expect(400);
      expect(
        await ctx.db.select().from(certifications).where(eq(certifications.name, 'Broken')),
      ).toHaveLength(0);
    });
  });

  describe('site config', () => {
    it('round-trips config through admin and public endpoints', async () => {
      const payload = {
        heroTitle: 'E2E hero title',
        heroIntroMd: 'Intro from the e2e suite.',
        socialLinks: [{ label: 'github', url: 'https://github.com/example' }],
        seoDefaultTitle: 'E2E SEO title',
        seoDefaultDescription: 'E2E SEO description',
        footerText: '© e2e',
      };
      await request(server)
        .put('/api/admin/config')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(200);

      const pub = await request(server).get('/api/config').expect(200);
      expect(pub.body.heroTitle).toBe(payload.heroTitle);
      expect(pub.body.socialLinks).toEqual(payload.socialLinks);
    });

    it('rejects malformed social links', async () => {
      await request(server)
        .put('/api/admin/config')
        .set('Authorization', `Bearer ${token}`)
        .send({
          heroTitle: 'x',
          heroIntroMd: '',
          socialLinks: [{ label: 'bad', url: 'not-a-url' }],
          seoDefaultTitle: '',
          seoDefaultDescription: '',
          footerText: '',
        })
        .expect(400);
    });
  });
});
