import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { requireEnv } from '@common/env';
import * as schema from '@db/schema';

export type SeedDb = NodePgDatabase<typeof schema>;

/** Both seeders talk to the database the same way; only the content differs. */
export function openDb(): { db: SeedDb; pool: Pool } {
  const pool = new Pool({ connectionString: requireEnv('DATABASE_URL') });
  return { db: drizzle(pool, { schema }), pool };
}
