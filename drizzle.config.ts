import { devEnv, env } from '@/env';
import { defineConfig } from 'drizzle-kit';

const isProd = process.env.NODE_ENV === 'production';

const databaseUrl = isProd ? env.DATABASE_URL : devEnv.DATABASE_URL;

export default defineConfig({
  schema: '**/server/db/schema.ts',
  out: './src/server/db/drizzle-migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
