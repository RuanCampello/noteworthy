'use server';

import { signIn } from '@/auth';
import { DEFAULT_REDIRECT } from '@/routes';
import { loginFormSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export async function login(values: z.infer<typeof loginFormSchema>) {
  const fields = loginFormSchema.safeParse(values);

  if (!fields.success) return { error: 'Invalid Fields' };

  const { email, password } = fields.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
}
