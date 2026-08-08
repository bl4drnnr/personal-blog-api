# personal-blog-api

API for [mikhailbahdashych.me](https://mikhailbahdashych.me) — NestJS 11 + Drizzle ORM + PostgreSQL.

Part of a three-repo system:

| Repo | Role |
| --- | --- |
| **personal-blog-api** (this) | Content API: posts, search, about/CV, site config, assets, auth |
| `personal-blog-front` | Public blog — Next.js SSR |
| `personal-blog-admin` | Admin panel — React SPA |

## Architecture

- **9 tables** (Drizzle schema in `src/db/schema.ts`, SQL migrations in `drizzle/`):
  `posts` unifies articles and projects behind a `type` enum; `about` +
  `positions`/`education`/`certifications` drive the CV page; `site_config`
  drives the home page; `assets` are S3 objects referenced by id; `users`/`sessions`
  hold the single admin account.
- **Search**: stored generated `tsvector` (title^A, excerpt^B, plain_text^C) with a
  GIN index; `websearch_to_tsquery` for phrases, prefix queries for typeahead;
  `ts_headline` produces `<mark>`-highlighted titles and snippets.
- **Auth**: bcrypt login → TOTP MFA (otplib) → 15-minute access JWT + 7-day
  rotating refresh JWT in an `HttpOnly; Secure; SameSite=Strict` cookie scoped to
  `/api/auth`. Replaying a rotated-out refresh token revokes the session.
- **Revalidation**: every admin mutation fires a webhook to the frontend, which
  invalidates the affected ISR cache tags.

## Endpoints

Public: `GET /api/posts`, `GET /api/posts/slugs`, `GET /api/posts/:slug`,
`GET /api/search`, `GET /api/config`, `GET /api/about`, `GET /api/health`.

Admin (`Authorization: Bearer <access token>`): CRUD under `/api/admin/posts`,
`/api/admin/assets` (multipart), `/api/admin/positions|education|certifications`,
`PUT /api/admin/about|config|password`. Auth flow under `/api/auth/*`.

### Interactive docs (OpenAPI / Swagger)

Every endpoint is documented with OpenAPI. With the API running:

- **Swagger UI** — [`/api/docs`](http://localhost:4201/api/docs) (click **Authorize** to
  paste a Bearer access token and try admin routes)
- **Raw OpenAPI JSON** — `/api/docs-json`

Set `SWAGGER_ENABLED=false` to disable the docs (e.g. to hide the API surface in
production).

## Project layout

Feature modules live under `src/modules/*`; shared infrastructure under
`src/db` (schema, connection) and `src/common` (guards, decorators, helpers).
Cross-directory imports use TypeScript path aliases for readability:

| Alias | Resolves to |
| --- | --- |
| `@db/*` | `src/db/*` |
| `@common/*` | `src/common/*` |
| `@modules/*` | `src/modules/*` |

Aliases resolve everywhere: `tsc-alias` rewrites them in the production build,
`ts-node` + `tsconfig-paths` in dev, `moduleNameMapper` in Jest, and `tsx`
natively for the seed/migrate scripts.

## Development

```bash
cp .env.example .env        # defaults match the dev compose stack
npm install
npm run dev:infra           # postgres :5433 + MinIO :9000/:9001
npm run migrate
npm run seed                # prints admin credentials (MFA enrolls on first login)
npm run start:dev           # http://localhost:4201/api
```

Tests (need the dev stack): `npm run test:e2e` — 34 tests across auth, posts,
search, assets/about/config.

| Script | Purpose |
| --- | --- |
| `npm run migration:generate` | Generate SQL migration from schema changes |
| `npm run migrate` / `migrate:prod` | Apply migrations (tsx / built dist) |
| `npm run seed` | Reset content tables + seed dev data |
| `npm run lint` / `format` | ESLint / Prettier |

## Deployment

Docker image (multi-stage, distroless-ish `node:22-slim`, RDS CA bundle baked
in) built by `.github/workflows/deploy.yml` → GHCR → SSH deploy to the EC2
compose stack. Full runbook, including the legacy-system inventory and cutover
steps: [`deploy/DEPLOYMENT.md`](deploy/DEPLOYMENT.md).
