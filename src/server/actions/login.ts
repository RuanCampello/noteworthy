'use server';

import { signIn } from '@/auth/auth';
import { getUserByEmail } from '@/queries/user';
import { DEFAULT_REDIRECT } from '@/routes';
import { loginFormSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

export async function login(
  values: z.infer<typeof loginFormSchema>,
): Promise<{ error: string | null }> {
  const fields = loginFormSchema.safeParse(values);
  const t = await getTranslations('ServerErrors');

  if (!fields.success) return { error: t('inv_field') };

  const { email, password } = fields.data;
  const user = await getUserByEmail(email);
  if (!user) return { error: t('email_not_found') };

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
