import { type Locale } from '@/lib/next-intl';
import type { Colour, NoteFormat } from '@/types/Enums';
import { z } from 'zod';

type Provider = 'google' | 'github';

export const loginFormSchema = z.object({
  email: z.string().email({
    message: 'E-mail must be valid',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
});

export const registerFormSchema = z.object({
  email: z.string().email({
    message: 'E-mail must be valid',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  username: z.string().min(6, {
    message: 'Username must be at least 6 characters',
  }),
});

export const registerWithProviderSchema = z.object({
  provider: z.string().transform((s) => s as Provider),
  providerAccountId: z.string(),
  accessToken: z.string(),
  expiresAt: z.number().optional(),
  scope: z.string(),
  idToken: z.string().optional(),
  email: z.string().email(),
  name: z.string(),
});

export const noteDialogSchema = z.object({
  name: z
    .string({ required_error: 'Note must have a name' })
    .min(4, { message: 'Note name must have at least 4 characters' }),
  colour: z.string().transform((s) => s as Colour | 'random'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({
    message: 'E-mail must be valid',
  }),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
});

export const userPreferencesSchema = z.object({
  noteFormat: z.string().transform((s) => s as NoteFormat),
  fullNote: z.boolean(),
  language: z.string().transform((s) => s as Locale),
});
