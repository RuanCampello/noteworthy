'use server';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/server/queries/user';
import { DEFAULT_REDIRECT } from '@/routes';
import { loginFormSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export async function login(
  values: z.infer<typeof loginFormSchema>
): Promise<{ error: string | null }> {
  const fields = loginFormSchema.safeParse(values);

  if (!fields.success) return { error: 'Invalid Fields' };

  const { email, password } = fields.data;
  const user = await getUserByEmail(email);
  if (!user) return { error: 'This Email is not registered' };

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT,
    });
    return { error: null };
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
