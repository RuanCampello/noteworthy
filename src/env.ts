import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_CLOUDFLARE_DEV_URL: z.string().url().optional(), // those variables are not meant to be set on dev env at all
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_HOSTNAME: z.string().url(),
  AUTH_SECRET: z.string(),
  INK_HOSTNAME: z.string().url(),
});

const envPath = process.env;

export const env = envSchema.parse(envPath);
