# Deployment

## 1. The legacy setup (documented before touching anything)

Before the 2026 rebuild, production ran on EC2 (eu-central-1) like this:

- **Three apps under pm2** on the host(s) referenced by the old workflow secrets
  `FE_HOST_IP` / `API_HOST_IP` / `ADMIN_HOST_IP`, deployed by SSH-ing as
  `deployer` and running build scripts that lived **on the server** (not in git).
- Old security groups: `bahdashych-on-security-front|api|admin`. The old
  workflows temporarily opened SSH — the API/admin ones to `0.0.0.0/0`.
- nginx config also lived only on the server.
- The admin panel was served by `ng serve` under pm2.
- Database: RDS PostgreSQL (`POSTGRES_*` env), TLS with `rejectUnauthorized: false`.
- The API had a `POST /api/control/trigger-deployment` endpoint that SSH-ed into
  the host using `DEPLOYMENT_SSH_PRIVATE_KEY` — removed in the rebuild.

**Do not delete** the old pm2 apps, server scripts, or keys until the new stack
has run cleanly for a while: `pm2 stop all` is reversible, `pm2 delete` is not.
The local key files (`deployer_key`, `personal-blog.pem`) and the untracked
`.env.development` / `.env.production` stay where they are.

## 2. New topology

One EC2 instance runs Docker Compose (this directory) at `/opt/blog`:

```
                    ┌──────────────────────── EC2 ────────────────────────┐
Internet ──443──▶ nginx ──▶ front (Next SSR :3000)   ──▶ api (:4201) ──▶ RDS
                    │  ├──▶ api   (NestJS  :4201)    ◀── revalidate ──┘
                    │  └──▶ admin (static  :80)              │
                    └── certbot (renewals)                   └──▶ S3 (assets)
```

- `mikhailbahdashych.me` → front, `api.` → api, `admin.` → admin (DNS unchanged)
- Images come from GHCR, built and pushed by each repo's GitHub Actions workflow
- Deploys: workflow opens SSH **only to the runner IP**, runs
  `docker compose pull <svc> && up -d <svc>`, revokes the rule (`if: always()`)

## 3. One-time EC2 preparation

```bash
# as a sudo-capable user on the instance
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER   # re-login afterwards

sudo mkdir -p /opt/blog/nginx && sudo chown -R $USER /opt/blog
# copy from this directory:
#   docker-compose.prod.yml -> /opt/blog/docker-compose.yml
#   nginx/blog.conf         -> /opt/blog/nginx/blog.conf
# create /opt/blog/.env.api and /opt/blog/.env.front from env/*.example

# GHCR access (images are private): create a GitHub PAT with read:packages
docker login ghcr.io -u mikhailbahdashych
```

### First certificate issuance

nginx can't serve 443 before certificates exist. Issue them once with a
standalone certbot, then start the stack:

```bash
sudo docker run --rm -p 80:80 \
  -v blog_letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d mikhailbahdashych.me -d api.mikhailbahdashych.me -d admin.mikhailbahdashych.me \
  --email mikhail.bahdashych@gmail.com --agree-tos --no-eff-email
```

(The compose project name must make the volume resolve to `blog_letsencrypt`;
start the stack from `/opt/blog` with `docker compose -p blog up -d`, or adjust.)

### Database & storage

- RDS: create database `personal_blog`; put the URL in `.env.api`
  (`DATABASE_SSL=true` — the image trusts the RDS CA bundle).
- Migrations run automatically on every deploy
  (`docker compose exec api node dist/db/migrate.js`); the first boot creates
  the whole schema. Singleton rows exist via migration `0001`.
- Create the first admin user directly (one-time, from the EC2 host):
  ```bash
  docker compose exec api node -e "
    const bcrypt = require('bcryptjs');
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined });
    const email = process.argv[1]; const password = process.argv[2];
    pool.query('INSERT INTO users (email, password_hash) VALUES (\$1, \$2)', [email, bcrypt.hashSync(password, 12)])
      .then(() => { console.log('created', email); process.exit(0); });
  " 'you@example.com' 'a-long-unique-password'
  ```
  MFA enrollment happens on first admin login.
- S3: the existing `bahdashych-on-security` bucket keeps working; the API needs
  an IAM user limited to `s3:PutObject`/`s3:DeleteObject`/`s3:GetObject` on it.

## 4. GitHub secrets (per repo)

| Secret | Value |
| --- | --- |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM user allowed only `ec2:AuthorizeSecurityGroupIngress`/`RevokeSecurityGroupIngress` on the SG below |
| `AWS_REGION` | `eu-central-1` |
| `EC2_SG_ID` | security group of the instance |
| `EC2_HOST` | instance public IP/DNS |
| `EC2_SSH_USER` | `deployer` |
| `EC2_SSH_KEY` | private key for that user |
| `EC2_SSH_HOST_KEY` | output of `ssh-keyscan -t ed25519 <EC2_HOST>` — pins the host key so deploys refuse to talk to an impostor host |

## 5. Cutover

1. Prepare `/opt/blog` (§3), bring the stack up: `docker compose -p blog up -d`
2. Verify all three vhosts respond over HTTPS; log into the admin, enroll MFA,
   create content; check `/sitemap.xml`, `/rss.xml`, search
3. `pm2 stop all` (leave the old apps stopped-but-present for rollback)
4. Merge-triggered deploys now update one service at a time

Rollback: `docker compose down` + `pm2 start all`.
