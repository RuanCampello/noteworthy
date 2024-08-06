import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
  CLOUDFLARE_ACCESS_KEY: z.string(),
  CLOUDFLARE_SECRET_KEY: z.string(),
  NEXT_PUBLIC_CLOUDFLARE_DEV_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  RESEND_API_KEY: z.string(),
  RESEND_DOMAIN: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  NEXT_PUBLIC_HOSTNAME: z.string().url(),
  AUTH_SECRET: z.string(),
});

const devSchema = z.object({
  AUTH_SECRET: z.string(),
  NEXT_PUBLIC_HOSTNAME: z.string().url(),
  DATABASE_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().optional(), // those variables are not meant to be set on dev env at all
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const envPath = process.env;

export const env =
  envPath.NODE_ENV === 'production'
    ? envSchema.parse(envPath)
    : devSchema.parse(envPath);
