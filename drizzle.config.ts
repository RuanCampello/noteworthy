import { env } from '@/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '**/server/db/schema.ts',
  out: './src/server/db/drizzle-migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
