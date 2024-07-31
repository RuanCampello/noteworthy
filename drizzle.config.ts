import { defineConfig } from 'drizzle-kit';
import { env } from '@/env';

export default defineConfig({
  schema: '**/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
