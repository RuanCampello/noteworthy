import { type Locale } from '@/utils/constants/locales';
import { z } from 'zod';
import type { Colour, NoteFormat } from '../types/database-types';

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
