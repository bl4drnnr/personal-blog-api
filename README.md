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
