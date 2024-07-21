'use server';

import { registerFormSchema } from '@/schemas';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/server/db';
import { getUserByEmail } from '@/queries/user';
import { signIn } from '@/auth/auth';
import { DEFAULT_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { createPlaceholderNote } from './note';
import { getTranslations } from 'next-intl/server';

export async function register(
  values: z.infer<typeof registerFormSchema>,
): Promise<{ error: string | null }> {
  const t = await getTranslations('ServerErrors');
  const fields = registerFormSchema.safeParse(values);

  if (!fields.success) return { error: t('inv_field') };

  const { email, password, username } = fields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await getUserByEmail(email);
  if (user) return { error: t('email_taken') };

  const owner = await db.user.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
    },
  });
  await createPlaceholderNote(owner.id);
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
