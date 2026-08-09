/**
 * Bulk mock content for the dev seeder. Everything is derived from the item's
 * index — no randomness — so two runs produce identical rows and identical
 * asset bytes, and a re-seed is a replacement rather than an accumulation.
 */
import { PostSeed } from './baseline';
import { gif, hue, png, svg } from './images';

export const MOCK_ARTICLES = 64;
export const MOCK_PROJECTS = 32;

/** Enough to page at 24, 48 and 96 in the admin without every page looking alike. */
export const MOCK_ASSETS = 40;

const TOPICS = [
  'CloudTrail delivery lag',
  'GuardDuty finding triage',
  'eBPF probe overhead',
  'Sigma rule packaging',
  'OIDC federation trust policies',
  'Kubernetes admission control',
  'S3 bucket policy drift',
  'IAM condition keys',
  'SSO session hijacking',
  'container image provenance',
  'Terraform state security',
  'secrets rotation at scale',
  'DNS exfiltration signals',
  'Lambda cold-start telemetry',
  'audit log retention',
  'break-glass access',
];

const ANGLES = [
  'what actually breaks in production',
  'notes from an on-call rotation',
  'measuring the false-positive budget',
  'a detection that survived a year',
  'the part the docs leave out',
  'cheap wins before the expensive ones',
  'what the audit log will not tell you',
  'rewriting it after the first incident',
];

const TAG_POOL = [
  ['aws', 'detection'],
  ['kubernetes', 'runtime'],
  ['ebpf', 'linux'],
  ['ci-cd', 'supply-chain'],
  ['iam', 'cloud'],
  ['terraform', 'iac'],
  ['incident-response', 'forensics'],
  ['sigma', 'siem'],
];

const STACKS = ['go', 'rust', 'python', 'typescript'];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Index → a (topic, angle) pair that no other index repeats, so titles and the
 * slugs derived from them stay unique without an index suffix giving the game
 * away.
 */
function titleFor(index: number): string {
  const topic = TOPICS[index % TOPICS.length];
  const angle = ANGLES[Math.floor(index / TOPICS.length) % ANGLES.length];
  return `${topic[0].toUpperCase()}${topic.slice(1)}: ${angle}`;
}

/** Descending, roughly weekly, starting a week back — so ordering is stable. */
function publishedAt(index: number): Date {
  const start = Date.UTC(2026, 7, 2, 9, 0, 0);
  return new Date(start - index * 7 * 24 * 60 * 60 * 1000);
}

function articleBody(topic: string, index: number): string {
  const paragraphs = 2 + (index % 4);
  const body = Array.from(
    { length: paragraphs },
    (_, i) =>
      `The interesting part of ${topic} is rarely the happy path. ` +
      `Run ${i + 2} showed the signal drifting once the pipeline was under real load, ` +
      `which is the case the original rule was never written for.`,
  ).join('\n\n');

  return [
    `Working notes on ${topic}, written while the details were still fresh.`,
    '',
    '## What we saw',
    '',
    body,
    '',
    '## Reproducing it',
    '',
    '```bash',
    `./bin/replay --scenario ${slugify(topic)} --window 24h`,
    '```',
    '',
    '## What changed',
    '',
    '- Narrowed the rule to the field that actually carries the signal',
    '- Added a suppression for the batch job that caused most of the noise',
    '- Alerted on the absence of the event, not only its presence',
    '',
    `> The rule is only as good as the telemetry underneath it.`,
  ].join('\n');
}

function projectBody(topic: string, stack: string): string {
  return [
    `A small ${stack} tool that came out of working on ${topic}.`,
    '',
    '## Why',
    '',
    `Doing this by hand does not survive contact with more than a handful of accounts.`,
    '',
    '## Usage',
    '',
    '```bash',
    `${slugify(topic).slice(0, 12)} scan --all-accounts --format json`,
    '```',
    '',
    '## Status',
    '',
    'Used in anger, documented well enough for someone else to pick up.',
  ].join('\n');
}

export function mockPosts(): PostSeed[] {
  const posts: PostSeed[] = [];

  for (let i = 0; i < MOCK_ARTICLES; i += 1) {
    const topic = TOPICS[i % TOPICS.length];
    const title = titleFor(i);
    // Every 9th stays a draft, so the public site and the admin disagree on the
    // count — which is exactly what draft handling needs to be tested against.
    const published = i % 9 !== 4;
    posts.push({
      type: 'article',
      slug: slugify(title),
      title,
      excerpt: `Notes on ${topic}: what we changed, what it cost, and what still hurts.`,
      contentMd: articleBody(topic, i),
      tags: TAG_POOL[i % TAG_POOL.length],
      featured: i < 3,
      published,
      publishedAt: published ? publishedAt(i) : null,
    });
  }

  for (let i = 0; i < MOCK_PROJECTS; i += 1) {
    // Same pairing trick as titleFor: walk topics on the inner cycle and stacks
    // on the outer one. Two independent modulo cycles repeat as soon as their
    // periods line up, which collided every slug past the sixteenth.
    const topic = TOPICS[i % TOPICS.length];
    const stack = STACKS[Math.floor(i / TOPICS.length) % STACKS.length];
    const name = `${slugify(topic).split('-').slice(0, 2).join('-')}-${stack}`;
    const published = i % 11 !== 7;
    posts.push({
      type: 'project',
      slug: name,
      title: name,
      excerpt: `${stack} tooling for ${topic}.`,
      contentMd: projectBody(topic, stack),
      tags: [stack, ...TAG_POOL[i % TAG_POOL.length].slice(0, 1)],
      featured: i < 2,
      published,
      publishedAt: published ? publishedAt(i * 2) : null,
      repoUrl: `https://github.com/mikhailbahdashych/${name}`,
    });
  }

  return posts;
}

// --- assets ------------------------------------------------------------------

const ASSET_NAMES = [
  'oidc-token-exchange-flow',
  'oidc-trust-policy-misconfig',
  'oidc-audit-log-timeline',
  'ebpf-ring-buffer-layout',
  'ebpf-probe-attach-points',
  'ebpf-cpu-overhead-chart',
  'ebpf-verifier-rejection',
  'sigil-cli-help-output',
  'sigil-rule-pack-layout',
  'sigil-deploy-dry-run',
  'hardened-lab-architecture',
  'hardened-lab-scp-matrix',
  'hardened-lab-breakglass-alert',
  'hardened-lab-account-map',
  'ttp-notes-attack-mapping',
  'ttp-notes-schema-check',
  'ttp-notes-telemetry-sources',
  'detection-pipeline-overview',
  'detection-rule-lifecycle',
  'detection-false-positive-budget',
  'cloudtrail-event-sample',
  'cloudtrail-lag-histogram',
  'cloudtrail-delivery-map',
  'guardduty-finding-detail',
  'guardduty-severity-split',
  'terraform-plan-diff',
  'terraform-module-graph',
  'terraform-state-locking',
  'kubernetes-admission-flow',
  'kubernetes-runtime-alerts',
  'kubernetes-network-policy',
  'incident-response-runbook',
  'incident-timeline-example',
  'incident-comms-template',
  'secrets-rotation-schedule',
  'dns-exfiltration-pattern',
  'profile-headshot',
  'site-open-graph-card',
  'site-logo-mark',
  'favicon-source',
];

const SIZES: [number, number][] = [
  [1200, 630],
  [960, 540],
  [800, 600],
  [640, 400],
  [480, 320],
  [320, 320],
];

export interface MockAsset {
  filename: string;
  contentType: string;
  alt: string;
  buffer: Buffer;
}

/** PNG mostly, with SVG and GIF mixed in so the admin's type column has variety. */
export function mockAssets(): MockAsset[] {
  return ASSET_NAMES.slice(0, MOCK_ASSETS).map((name, i) => {
    const colour = hue(i);
    const [width, height] = SIZES[i % SIZES.length];
    const alt = `${name.replace(/-/g, ' ')} (${width}×${height})`;

    if (i % 5 === 1) {
      return {
        filename: `${name}.svg`,
        contentType: 'image/svg+xml',
        alt,
        buffer: svg(width, height, colour, name),
      };
    }
    if (i % 13 === 7) {
      return {
        filename: `${name}.gif`,
        contentType: 'image/gif',
        alt,
        buffer: gif(width, height, colour),
      };
    }
    return {
      filename: `${name}.png`,
      contentType: 'image/png',
      alt,
      buffer: png(width, height, colour),
    };
  });
}
