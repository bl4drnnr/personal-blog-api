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

## Security posture

Decisions worth knowing before changing this code:

| Control | Where | Note |
| --- | --- | --- |
| Per-client rate limiting | `app.setup.ts` | `trust proxy = 1` makes `req.ip` the address nginx appends. Removing it makes every request look like it came from the nginx container, so the whole internet shares one bucket — 5 login attempts/min globally, i.e. a trivial lockout. |
| Token separation | guards + `tokens.service.ts` | Access, refresh and temp-MFA tokens share a secret but carry a `type` claim every guard checks, so none can stand in for another. Refresh tokens rotate; replaying a rotated-out one revokes the session. |
| Rotation grace | `tokens.service.ts` | The jti a rotation retires stays valid for 30s in a second slot. Tabs share one cookie jar, so opening a second tab presents the same refresh token twice; without the grace the loser looked like a replay and revoked the session, logging every tab out. The grace path issues an access token only — it never rotates the cookie. Anything older still revokes. |
| Constant-time login | `auth.service.ts` | An unknown email is still compared against a dummy hash. Skipping it returns ~7ms vs ~240ms and enumerates accounts. |
| Password change | `auth.service.ts` | Re-issues the session, which invalidates every refresh token handed out earlier. Access tokens already issued stay valid until they expire (15m). |
| Search output | `search.service.ts` | `ts_headline` does not escape; it marks hits with control characters, the string is escaped, then only those become `<mark>`. |
| Upload validation | `assets/mime.ts` | Content type must be on the allowlist *and* match the file's signature. The stored extension comes from the type, never the filename. SVG is stored `Content-Disposition: attachment` so it cannot run as a document. |
| Markdown | front/admin `lib/markdown.ts` | Raw HTML is dropped by remark-rehype; `rehypeSafeUrls` additionally restricts link/image URLs to http/https/mailto/tel, which is what stops `[x](javascript:…)`. |
| CSP | `deploy/nginx/blog.conf` | Set per vhost for the blog and admin. The API sets its own via helmet, so nginx adds none there. |
| Swagger | `SWAGGER_ENABLED` | Off in production — it publishes the full admin surface. |

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
npm run dev:infra           # postgres :5433 (+ MinIO :9000/:9001 if you use it)
npm run migrate
npm run seed:dev            # ~100 posts, ~40 uploaded assets, admin credentials
npm run start:dev           # http://localhost:4201/api
```

Tests (need the dev stack): `npm run test:e2e` — 35 tests across auth, posts,
search, assets/about/config.

| Script | Purpose |
| --- | --- |
| `npm run migration:generate` | Generate SQL migration from schema changes |
| `npm run migrate` / `migrate:prod` | Apply migrations (tsx / built dist) |
| `npm run seed` | Reset content tables + seed the baseline (admin, CV, 6 posts) |
| `npm run seed:dev` | Baseline **plus** bulk mock posts and uploaded assets |
| `npm run lint` / `format` | ESLint / Prettier |

### Storage layout

Object keys are content hashes, so two environments storing the same file would
otherwise land on the same key. `S3_KEY_PREFIX` keeps them apart — one bucket,
one prefix per environment:

| Environment | Prefix | Key shape |
| --- | --- | --- |
| Development | `dev` | `dev/2026/08/<sha256-16>.png` |
| Production | `prod` | `prod/2026/08/<sha256-16>.png` |

`npm run seed:dev` **empties its own prefix** before uploading, so the bucket
always mirrors the database. It refuses to run with `NODE_ENV=production`, and
it only ever touches the prefix it is configured with — but that is also why
production must never be pointed at `dev`.

Credentials are resolved by the AWS SDK's default chain when `S3_ACCESS_KEY_ID`
and `S3_SECRET_ACCESS_KEY` are unset, so a developer machine uses its existing
`~/.aws/credentials` rather than keeping a second copy of a live key in `.env`.
Set the pair explicitly where there is no ambient credential (containers, CI).
To drop the AWS dependency entirely, point `S3_ENDPOINT` at the MinIO service in
`docker-compose.dev.yml` — the commented block in `.env.example` has the values.

### What the dev seed creates

- 67 articles and 35 projects, including drafts and featured posts, dated
  weekly backwards so ordering and pagination are stable between runs
- 40 assets — PNG, SVG and GIF — generated byte by byte and uploaded through the
  same `S3Service` the API uses, then attached as hero images to every third post
- One admin account; `SEED_ADMIN_PASSWORD` if set, otherwise a fresh random one
  printed at the end

Content is derived from each item's index rather than randomised, so re-seeding
reproduces the same rows and the same object keys.

## Deployment

This repo is the **deployment hub** for all three apps. One EC2 instance runs a
Docker Compose stack — nginx (TLS) in front of the Next.js frontend, this API,
and the static admin — talking to RDS PostgreSQL and S3.

```
                    ┌──────────────────────── EC2 ────────────────────────┐
Internet ──443──▶ nginx ──▶ front (Next SSR :3000)   ──▶ api (:4201) ──▶ RDS
                    │  ├──▶ api   (NestJS  :4201)     ◀── revalidate ──┘
                    │  └──▶ admin (static  :80)               │
                    └── certbot (auto-renew)                  └──▶ S3 (assets)
```

- `mikhailbahdashych.me` → front, `api.` → api, `admin.` → admin
- App images are built by each repo's GitHub Actions and pushed to GHCR
- `docker-compose.prod.yml` (repo root) orchestrates everything;
  `deploy/nginx/blog.conf` holds the vhosts

### Prerequisites

- An EC2 instance with Docker + the compose plugin, ports 80/443 open
- RDS PostgreSQL with a `personal_blog` database
- An S3 bucket and an IAM user scoped to `s3:{Put,Get,Delete}Object` on it
- DNS A records for the apex + `api.` + `admin.` pointing at the instance

### One-time host setup

```bash
# Clone this repo to /opt/blog (the compose file + nginx config live here)
sudo git clone https://github.com/mikhailbahdashych/personal-blog-api.git /opt/blog
sudo chown -R "$USER" /opt/blog && cd /opt/blog

# Fill in production secrets
cp .env.prod.example .env.prod && "$EDITOR" .env.prod

# GHCR images are private — log in with a PAT that has read:packages
docker login ghcr.io -u mikhailbahdashych
```

**Issue TLS certificates once** (nginx can't start on 443 without them):

```bash
docker run --rm -p 80:80 -v personal-blog-api_letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d mikhailbahdashych.me -d api.mikhailbahdashych.me -d admin.mikhailbahdashych.me \
  --email you@example.com --agree-tos --no-eff-email
```

**Start the stack** (the certbot container renews automatically afterwards):

```bash
docker compose -f docker-compose.prod.yml up -d
```

Migrations apply automatically on every deploy; the first boot creates the whole
schema (singleton rows come from migration `0001`). Create the first admin user
once — MFA enrolls on first login:

```bash
docker compose -f docker-compose.prod.yml exec api node -e "
  const { hashSync } = require('bcryptjs');
  const { Pool } = require('pg');
  const [email, password] = process.argv.slice(1);
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true } });
  pool.query('INSERT INTO users (email, password_hash) VALUES (\$1, \$2)', [email, hashSync(password, 12)])
    .then(() => console.log('Created admin:', email)).then(() => pool.end());
" you@example.com 'a-long-unique-password'
```

### Continuous deployment

A push to `master` builds a fresh image, pushes it to GHCR, then SSHes to the
host and rolls the service — opening port 22 **only to the runner's IP** and
revoking it afterwards (`.github/workflows/deploy.yml`). Required repository
secrets:

| Secret | Value |
| --- | --- |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM user allowed only `ec2:AuthorizeSecurityGroupIngress` / `RevokeSecurityGroupIngress` on the SG below |
| `AWS_REGION` | e.g. `eu-central-1` |
| `EC2_SG_ID` | the instance's security group |
| `EC2_HOST` | instance public IP/DNS |
| `EC2_SSH_USER` / `EC2_SSH_KEY` | deploy user + its private key |
| `EC2_SSH_HOST_KEY` | `ssh-keyscan -t ed25519 <EC2_HOST>` output — pins the host key so deploys refuse an impostor host |

To roll back, pin a specific image in `docker-compose.prod.yml`
(`ghcr.io/…/personal-blog-api:<sha>`) and `docker compose -f docker-compose.prod.yml up -d api`.
