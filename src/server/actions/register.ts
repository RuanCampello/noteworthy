'use server';

import { signIn } from '@/auth/auth';
import { DEFAULT_REDIRECT } from '@/routes';
import { registerFormSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';
import { createPlaceholderNote } from './note';

export async function register(
  values: z.infer<typeof registerFormSchema>,
): Promise<{ error: string | null }> {
  const t = await getTranslations('ServerErrors');
  const fields = registerFormSchema.safeParse(values);

  if (!fields.success) return { error: t('inv_field') };
  const { email, password, username } = fields.data;

  const response = await fetch(`http://localhost:6969/users/${email}`, {
    method: 'get',
    cache: 'force-cache',
  });
  if (response.ok) return { error: t('email_taken') };

  const registerRes = await fetch('http://localhost:6969/register', {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      name: username,
    }),
  });

  const id = await registerRes.json();

  await createPlaceholderNote(id);
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
          return { error: t('inv_credentials') };
        default:
          return { error: t('default_error') };
      }
    }
    throw error;
  }
}
