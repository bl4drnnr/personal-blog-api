import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { requireEnv } from './src/common/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: requireEnv('DATABASE_URL'),
  },
});
