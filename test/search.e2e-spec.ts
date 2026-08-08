import { inArray } from 'drizzle-orm';
import request from 'supertest';
import { markdownToPlainText } from '../src/common/content';
import { posts } from '../src/db/schema';
import { createTestApp, TestApp } from './app.harness';

const SLUGS = ['e2e-search-quokka', 'e2e-search-wombat', 'e2e-search-draft'];

describe('Search (e2e)', () => {
  let ctx: TestApp;
  let server: ReturnType<TestApp['app']['getHttpServer']>;

  beforeAll(async () => {
    ctx = await createTestApp();
    server = ctx.app.getHttpServer();
    await ctx.db.delete(posts).where(inArray(posts.slug, SLUGS));

    const mk = (slug: string, title: string, content: string, published: boolean) => ({
      type: 'article' as const,
      slug,
      title,
      excerpt: `${title} excerpt`,
      contentMd: content,
      plainText: markdownToPlainText(content, ['e2e-search']),
      tags: ['e2e-search'],
      featured: false,
      published,
      publishedAt: published ? new Date('2026-01-15T00:00:00Z') : null,
    });

    await ctx.db
      .insert(posts)
      .values([
        mk(
          SLUGS[0],
          'Tracking quokka movements with telemetry',
          'Long-term quokka telemetry reveals movement baselining opportunities for marsupial detection.',
          true,
        ),
        mk(
          SLUGS[1],
          'Wombat burrow architecture',
          'Wombats dig structured burrows. Nothing about the other marsupial here.',
          true,
        ),
        mk(
          SLUGS[2],
          'Secret quokka draft',
          'Unpublished quokka research that must not leak through search.',
          false,
        ),
      ]);
  });

  afterAll(async () => {
    await ctx.db.delete(posts).where(inArray(posts.slug, SLUGS));
    await ctx.app.close();
  });

  it('finds full-word matches and wraps them in <mark>', async () => {
    const res = await request(server).get('/api/search?q=quokka telemetry').expect(200);
    expect(res.body.total).toBe(1);
    expect(res.body.items[0].slug).toBe(SLUGS[0]);
    expect(res.body.items[0].titleHtml).toContain('<mark>');
    expect(res.body.items[0].snippetHtml).toContain('<mark>');
  });

  it('prefix-matches single tokens for typeahead', async () => {
    const res = await request(server).get('/api/search?q=quok').expect(200);
    expect(res.body.total).toBe(1);
    expect(res.body.items[0].slug).toBe(SLUGS[0]);
  });

  it('matches across title and body with ranking', async () => {
    const res = await request(server).get('/api/search?q=marsupial').expect(200);
    expect(res.body.total).toBe(2);
    const slugs = res.body.items.map((i: { slug: string }) => i.slug);
    expect(slugs).toEqual(expect.arrayContaining([SLUGS[0], SLUGS[1]]));
  });

  it('never returns drafts', async () => {
    const res = await request(server).get('/api/search?q=quokka').expect(200);
    const slugs = res.body.items.map((i: { slug: string }) => i.slug);
    expect(slugs).not.toContain(SLUGS[2]);
  });

  it('returns empty results for too-short or operator-only queries', async () => {
    const short = await request(server).get('/api/search?q=a').expect(200);
    expect(short.body.total).toBe(0);
    const ops = await request(server).get('/api/search?q=!!').expect(200);
    expect(ops.body.total).toBe(0);
  });

  it('returns an empty set for no matches', async () => {
    const res = await request(server).get('/api/search?q=xyzzynomatch').expect(200);
    expect(res.body).toEqual({ items: [], total: 0, page: 1, per: 20 });
  });
});
