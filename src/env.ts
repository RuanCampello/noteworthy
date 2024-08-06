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

const devEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_HOSTNAME: z.string().url(),
  AUTH_SECRET: z.string(),
});

const envPath = process.env;

export const env = envSchema.parse(envPath);
export const devEnv = devEnvSchema.parse(envPath);
