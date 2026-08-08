# personal-blog-api

API for [mikhailbahdashych.me](https://mikhailbahdashych.me) — NestJS 11, Drizzle ORM, PostgreSQL.

> Rebuild in progress. Full documentation (deployment, architecture) lands with the final infra PR.

## Development

```bash
cp .env.example .env        # defaults work with the dev compose stack
npm install
npm run dev:infra           # postgres :5433 + MinIO :9000/:9001
npm run migrate
npm run seed                # prints admin credentials
npm run start:dev           # http://localhost:4201/api
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run migration:generate` | Generate SQL migration from `src/db/schema.ts` |
| `npm run migrate` | Apply migrations from `drizzle/` |
| `npm run seed` | Reset content tables + seed dev data (prints admin credentials) |
| `npm run test:e2e` | End-to-end tests (needs the dev database) |
