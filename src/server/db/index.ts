import 'server-only';

import { devEnv, env } from '@/env';
import * as schema from '@/server/db/schema';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle as drizzleDev } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const db =
  process.env.NODE_ENV === 'production'
    ? drizzle(neon(env.DATABASE_URL), { schema })
    : drizzleDev(new Pool({ connectionString: devEnv.DATABASE_URL }), {
        schema,
      });
