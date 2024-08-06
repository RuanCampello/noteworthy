import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_CLOUDFLARE_DEV_URL: z.string().url().optional(), // those variables are not meant to be set on dev env at all
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_BUCKET_NAME: z.string().optional(),
  CLOUDFLARE_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_DOMAIN: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_HOSTNAME: z.string().url(),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string(),
});

const envPath = process.env;

export const env = envSchema.parse(envPath);
