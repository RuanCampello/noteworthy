import 'server-only';

import { env } from '@/env';
import * as schema from '@/server/db/schema';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
