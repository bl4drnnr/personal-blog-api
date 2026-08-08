import { Inject, Injectable } from '@nestjs/common';
import { sql, SQL } from 'drizzle-orm';
import { Database, DRIZZLE } from '../../db/db.module';

export interface SearchResultItem {
  slug: string;
  type: 'article' | 'project';
  tags: string[];
  publishedAt: string;
  /** Title with matches wrapped in <mark> — only that tag, produced by ts_headline. */
  titleHtml: string;
  snippetHtml: string;
}

type SearchRow = {
  slug: string;
  type: 'article' | 'project';
  tags: string[];
  published_at: string;
  title_html: string;
  snippet_html: string;
};

const HEADLINE_TITLE = 'StartSel=<mark>,StopSel=</mark>,HighlightAll=true';
const HEADLINE_SNIPPET = 'StartSel=<mark>,StopSel=</mark>,MaxWords=22,MinWords=10,MaxFragments=1';

@Injectable()
export class SearchService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async search(rawQuery: string, page: number, per: number) {
    const empty = { items: [] as SearchResultItem[], total: 0, page, per };
    const query = rawQuery.trim();
    if (query.length < 2) {
      return empty;
    }

    // Single tokens get prefix matching so the popup finds half-typed words;
    // multi-word queries go through websearch syntax (quotes, or, -).
    let tsquery: SQL;
    if (/\s/.test(query)) {
      tsquery = sql`websearch_to_tsquery('english', ${query})`;
    } else {
      const token = query.replace(/[^\p{L}\p{N}]/gu, '');
      if (token.length < 2) {
        return empty;
      }
      tsquery = sql`to_tsquery('english', ${token + ':*'})`;
    }

    const countResult = await this.db.execute<{ total: number }>(sql`
      SELECT count(*)::int AS total
      FROM posts, (SELECT ${tsquery} AS tsq) q
      WHERE published AND search @@ q.tsq
    `);
    const total = countResult.rows[0].total;
    if (total === 0) {
      return empty;
    }

    const result = await this.db.execute<SearchRow>(sql`
      SELECT
        slug,
        type,
        tags,
        published_at,
        ts_headline('english', title, q.tsq, ${HEADLINE_TITLE}) AS title_html,
        ts_headline('english', plain_text, q.tsq, ${HEADLINE_SNIPPET}) AS snippet_html
      FROM posts, (SELECT ${tsquery} AS tsq) q
      WHERE published AND search @@ q.tsq
      ORDER BY ts_rank_cd(search, q.tsq) DESC, published_at DESC
      LIMIT ${per} OFFSET ${(page - 1) * per}
    `);

    const items: SearchResultItem[] = result.rows.map((row) => ({
      slug: row.slug,
      type: row.type,
      tags: row.tags,
      publishedAt: row.published_at,
      titleHtml: row.title_html,
      snippetHtml: row.snippet_html,
    }));

    return { items, total, page, per };
  }
}
