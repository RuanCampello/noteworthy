/* eslint-disable no-var */
import 'server-only';

import { env } from '@/env';
import { PrismaClient } from '@prisma/client';
import { neon } from '@neondatabase/serverless';
import { drizzle as Drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/server/db/schema';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;

const sql = neon(env.DATABASE_URL);
export const drizzle = Drizzle(sql, { schema });
