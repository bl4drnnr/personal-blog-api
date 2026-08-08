import { inArray } from 'drizzle-orm';
import request from 'supertest';
import { posts } from '../src/db/schema';
import { createTestApp, TestApp } from './app.harness';
import { createAuthedUser, deleteUser } from './auth-helper';

const USER_EMAIL = 'e2e-posts@test.local';
const SLUGS = ['e2e-first-post', 'e2e-renamed-post', 'e2e-second-post'];

const basePost = {
  type: 'article' as const,
  title: 'E2E first post',
  excerpt: 'An excerpt for the first post.',
  contentMd: '## Heading\n\nSome **markdown** content with `code` and enough words to count.',
  tags: ['e2e', 'testing'],
  featured: false,
  published: false,
};

describe('Posts (e2e)', () => {
  let ctx: TestApp;
  let server: ReturnType<TestApp['app']['getHttpServer']>;
  let token: string;
  let postId: string;

  beforeAll(async () => {
    ctx = await createTestApp();
    server = ctx.app.getHttpServer();
    token = await createAuthedUser(ctx, USER_EMAIL);
    await ctx.db.delete(posts).where(inArray(posts.slug, SLUGS));
  });

  afterAll(async () => {
    await ctx.db.delete(posts).where(inArray(posts.slug, SLUGS));
    await deleteUser(ctx, USER_EMAIL);
    await ctx.app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    await request(server).post('/api/admin/posts').send(basePost).expect(401);
  });

  it('creates a draft with computed reading time and plain text', async () => {
    const res = await request(server)
      .post('/api/admin/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...basePost, slug: SLUGS[0] })
      .expect(201);
    postId = res.body.id;
    expect(res.body.publishedAt).toBeNull();
    expect(res.body.readingTimeMin).toBe(1);
    expect(res.body.plainText).toContain('markdown content');
    expect(res.body.plainText).not.toContain('**');
    expect(res.body.plainText).toContain('e2e testing');
  });

  it('rejects a duplicate slug with 409', async () => {
    await request(server)
      .post('/api/admin/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...basePost, slug: SLUGS[0] })
      .expect(409);
  });

  it('hides drafts from the public endpoints', async () => {
    const list = await request(server).get('/api/posts?type=article').expect(200);
    const slugs = list.body.items.map((i: { slug: string }) => i.slug);
    expect(slugs).not.toContain(SLUGS[0]);

    await request(server).get(`/api/posts/${SLUGS[0]}`).expect(404);

    const slugList = await request(server).get('/api/posts/slugs').expect(200);
    expect(slugList.body.map((s: { slug: string }) => s.slug)).not.toContain(SLUGS[0]);
  });

  it('publishes a draft and stamps published_at exactly once', async () => {
    const published = await request(server)
      .put(`/api/admin/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...basePost, slug: SLUGS[0], published: true })
      .expect(200);
    const firstPublishedAt = published.body.publishedAt;
    expect(firstPublishedAt).not.toBeNull();

    const republished = await request(server)
      .put(`/api/admin/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...basePost, slug: SLUGS[0], published: true, title: 'E2E first post (edited)' })
      .expect(200);
    expect(republished.body.publishedAt).toBe(firstPublishedAt);
  });

  it('serves the published post publicly', async () => {
    const res = await request(server).get(`/api/posts/${SLUGS[0]}`).expect(200);
    expect(res.body.title).toBe('E2E first post (edited)');
    expect(res.body.contentMd).toContain('## Heading');
    // The search projection stays internal
    expect(res.body.plainText).toBeUndefined();
  });

  it('renames a slug without losing the post', async () => {
    await request(server)
      .put(`/api/admin/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...basePost, slug: SLUGS[1], published: true })
      .expect(200);
    await request(server).get(`/api/posts/${SLUGS[1]}`).expect(200);
    await request(server).get(`/api/posts/${SLUGS[0]}`).expect(404);
  });

  it('filters featured posts', async () => {
    await request(server)
      .post('/api/admin/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...basePost,
        slug: SLUGS[2],
        title: 'E2E second post',
        featured: true,
        published: true,
      })
      .expect(201);

    const res = await request(server).get('/api/posts?type=article&featured=true').expect(200);
    const slugs = res.body.items.map((i: { slug: string }) => i.slug);
    expect(slugs).toContain(SLUGS[2]);
    expect(slugs).not.toContain(SLUGS[1]);
  });

  it('validates pagination parameters', async () => {
    await request(server).get('/api/posts?per=15').expect(400);
    await request(server).get('/api/posts?page=0').expect(400);
  });

  it('deletes a post', async () => {
    await request(server)
      .delete(`/api/admin/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
    await request(server).get(`/api/posts/${SLUGS[1]}`).expect(404);
  });
});
