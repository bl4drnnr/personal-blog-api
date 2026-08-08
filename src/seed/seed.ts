import 'dotenv/config';
import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { hashSync } from 'bcryptjs';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { markdownToPlainText, readingTimeMin } from '@common/content';
import { requireEnv } from '@common/env';
import * as schema from '@db/schema';

const md = (name: string) => readFileSync(join(__dirname, 'content', name), 'utf8');

async function main() {
  const pool = new Pool({ connectionString: requireEnv('DATABASE_URL') });
  const db = drizzle(pool, { schema });

  await db.execute(
    sql`TRUNCATE posts, positions, education, certifications, assets, site_config, about RESTART IDENTITY CASCADE`,
  );

  // --- admin user -----------------------------------------------------------
  const email = requireEnv('SEED_ADMIN_EMAIL');
  // Password generation (rather than a required env var) is deliberate: a fresh
  // random credential per seed run, printed once below.
  const password = process.env.SEED_ADMIN_PASSWORD || randomBytes(9).toString('base64url');
  const passwordHash = hashSync(password, 12);

  await db
    .insert(schema.users)
    .values({ email, passwordHash })
    .onConflictDoUpdate({
      target: schema.users.email,
      set: { passwordHash, mfaSecret: null, mfaEnabled: false, updatedAt: new Date() },
    });

  // --- site config ----------------------------------------------------------
  await db.insert(schema.siteConfig).values({
    id: 1,
    heroTitle: 'Security engineering notes — detection, cloud, and the occasional write-up.',
    heroIntroMd:
      'I build detection pipelines and break cloud things to understand how they fail. This is where the notes end up: longer write-ups on the blog, smaller tools under projects.',
    socialLinks: [
      { label: 'github', url: 'https://github.com/bl4drnnr' },
      { label: 'linkedin', url: 'https://www.linkedin.com/in/mikhailbahdashych/' },
    ],
    seoDefaultTitle: 'Mikhail Bahdashych — Security Engineer',
    seoDefaultDescription:
      'Security engineering notes — detection engineering, cloud security, and project write-ups.',
    footerText: '© 2026 Mikhail Bahdashych',
  });

  // --- about / cv -----------------------------------------------------------
  await db.insert(schema.about).values({
    id: 1,
    fullName: 'Mikhail Bahdashych',
    profileMd:
      'Security engineer focused on detection engineering and cloud security. I like systems that fail loudly, rules an on-call engineer can explain in one sentence, and deleting more code than I write.',
    location: 'Kraków, Poland',
    contactEmail: 'mikhail.bahdashych@gmail.com',
    seoTitle: 'About — Mikhail Bahdashych',
    seoDescription:
      'Security engineer: detection engineering, cloud security, professional history and certifications.',
  });

  await db.insert(schema.positions).values([
    {
      company: 'Company A',
      companyUrl: 'https://example.com',
      title: 'Senior Security Engineer',
      description: 'Detection engineering and cloud security for a fintech platform.',
      location: 'Kraków',
      startDate: '2024-07-01',
      endDate: null,
      bullets: [
        'Detection engineering: built and maintain a rule pipeline covering cloud control-plane and runtime signals.',
        'Cloud security: hardened OIDC federation across ~200 CI pipelines; removed all long-lived deploy keys.',
        'Incident response: primary on-call for security incidents; wrote the playbooks the team actually uses.',
      ],
      skills: ['aws', 'detection', 'terraform', 'python'],
      sortOrder: 0,
    },
    {
      company: 'Company B',
      companyUrl: 'https://example.org',
      title: 'Security Engineer',
      description: 'Product security and infrastructure hardening.',
      location: 'Warsaw',
      startDate: '2021-03-01',
      endDate: '2024-06-30',
      bullets: [
        'Ran the internal bug bounty triage and fixed the systemic classes behind the reports.',
        'Introduced infrastructure-as-code security scanning into CI with a <1% false-positive budget.',
      ],
      skills: ['appsec', 'kubernetes', 'go'],
      sortOrder: 1,
    },
  ]);

  await db.insert(schema.education).values([
    {
      institution: 'Example University of Technology',
      degree: 'M.Sc.',
      field: 'Cybersecurity',
      location: 'Kraków',
      startDate: '2019-10-01',
      endDate: '2021-06-30',
      notes: 'Thesis: anomaly detection in cloud audit logs using session baselining.',
      sortOrder: 0,
    },
  ]);

  await db.insert(schema.certifications).values([
    {
      name: 'OSCP',
      issuer: 'OffSec',
      description: 'Hands-on penetration testing certification; 24-hour practical exam.',
      issuedDate: '2023-08-01',
      expiresDate: null,
      credentialUrl: 'https://www.credential.net/example',
      sortOrder: 0,
    },
    {
      name: 'AWS Security — Specialty',
      issuer: 'Amazon Web Services',
      description: 'Cloud security architecture, detection, and incident response on AWS.',
      issuedDate: '2024-03-01',
      expiresDate: '2027-03-01',
      credentialUrl: 'https://www.credly.com/example',
      sortOrder: 1,
    },
  ]);

  // --- posts ----------------------------------------------------------------
  const insertPost = (p: {
    type: 'article' | 'project';
    slug: string;
    title: string;
    excerpt: string;
    contentMd: string;
    tags: string[];
    featured: boolean;
    published: boolean;
    publishedAt: Date | null;
    repoUrl?: string;
  }) =>
    db.insert(schema.posts).values({
      ...p,
      plainText: markdownToPlainText(p.contentMd, p.tags),
      readingTimeMin: readingTimeMin(p.contentMd),
    });

  await insertPost({
    type: 'article',
    slug: 'abusing-oidc-token-exchange-in-ci-pipelines',
    title: 'Abusing OIDC token exchange in CI pipelines',
    excerpt:
      'How permissive trust policies turn keyless CI authentication into an organization-wide credential, and how to detect the abuse before audit logs land.',
    contentMd: md('oidc-article.md'),
    tags: ['cloud', 'ci-cd'],
    featured: true,
    published: true,
    publishedAt: new Date('2026-07-14T09:00:00Z'),
  });

  await insertPost({
    type: 'article',
    slug: 'notes-on-ebpf-based-runtime-detection',
    title: 'Notes on eBPF-based runtime detection',
    excerpt:
      'Working notes from running an eBPF detection stack in production: what the kernel gives you, which rules survive, and what it costs.',
    contentMd: md('ebpf-article.md'),
    tags: ['detection', 'ebpf'],
    featured: true,
    published: true,
    publishedAt: new Date('2026-06-02T09:00:00Z'),
  });

  await insertPost({
    type: 'article',
    slug: 'threat-modeling-the-home-lab',
    title: 'Threat modeling the home lab',
    excerpt: 'A draft that is not published yet — used to verify draft handling end to end.',
    contentMd: '## Draft\n\nThis post is a draft and must never appear on the public site.',
    tags: ['misc'],
    featured: false,
    published: false,
    publishedAt: null,
  });

  await insertPost({
    type: 'project',
    slug: 'sigil',
    title: 'sigil — detection rule packaging CLI',
    excerpt:
      'CLI for packaging, versioning and deploying Sigma-based detection rules with per-environment overrides.',
    contentMd:
      'sigil packages detection rules the way a package manager packages code: versioned bundles, dependency resolution between rule packs, and per-environment overrides.\n\n## Why\n\nCopy-pasting Sigma rules between repos loses provenance and breaks silently. sigil keeps rules in one place and compiles targets per backend.\n\n## Usage\n\n```bash\nsigil build --target splunk --env prod\nsigil deploy --dry-run\n```',
    tags: ['go', 'sigma'],
    featured: true,
    published: true,
    publishedAt: new Date('2026-05-10T09:00:00Z'),
    repoUrl: 'https://github.com/bl4drnnr/sigil',
  });

  await insertPost({
    type: 'project',
    slug: 'hardened-lab',
    title: 'hardened-lab',
    excerpt:
      'Terraform modules for a deliberately hardened AWS lab environment: SCPs, detection baselines, and break-glass access.',
    contentMd:
      'Opinionated Terraform for standing up a hardened multi-account AWS lab.\n\n## Contents\n\n- Service control policies that deny the classic escalation paths\n- CloudTrail → detection pipeline wiring\n- Break-glass roles with alerting on use',
    tags: ['terraform', 'aws'],
    featured: true,
    published: true,
    publishedAt: new Date('2026-04-20T09:00:00Z'),
    repoUrl: 'https://github.com/bl4drnnr/hardened-lab',
  });

  await insertPost({
    type: 'project',
    slug: 'ttp-notes',
    title: 'ttp-notes',
    excerpt:
      'Structured notes mapping observed attacker techniques to ATT&CK with detection ideas.',
    contentMd:
      'A living collection of technique notes: each entry maps an observed behavior to ATT&CK, lists telemetry sources, and sketches a detection.\n\n## Format\n\nOne markdown file per technique, validated in CI against a small schema.',
    tags: ['detection', 'att&ck'],
    featured: false,
    published: true,
    publishedAt: new Date('2026-03-15T09:00:00Z'),
    repoUrl: 'https://github.com/bl4drnnr/ttp-notes',
  });

  await pool.end();

  console.log('Seed complete.');
  console.log(`Admin email:    ${email}`);
  console.log(`Admin password: ${password}`);
  console.log('MFA: not enrolled — the admin panel will walk through TOTP setup on first login.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
