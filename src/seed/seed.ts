/**
 * Baseline seed: the admin account and the real content. For a database with
 * enough posts and assets to exercise pagination, use `npm run seed:dev`.
 */
import 'dotenv/config';
import {
  insertPosts,
  seedAbout,
  seedAdmin,
  seedSiteConfig,
  showcasePosts,
  truncateAll,
} from './baseline';
import { openDb } from './client';

async function main() {
  const { db, pool } = openDb();

  await truncateAll(db);
  const admin = await seedAdmin(db);
  await seedSiteConfig(db);
  await seedAbout(db);
  await insertPosts(db, showcasePosts());

  await pool.end();

  console.log('Seed complete.');
  console.log(`Admin email:    ${admin.email}`);
  console.log(`Admin password: ${admin.password}`);
  console.log('MFA: not enrolled — the admin panel will walk through TOTP setup on first login.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
