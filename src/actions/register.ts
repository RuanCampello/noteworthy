'use server';

import { registerFormSchema } from '@/schemas';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { getUserByEmail } from '@/data/user';
import { signIn } from '@/auth';
import { DEFAULT_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { createPlaceholderNote } from './note';

export async function register(
  values: z.infer<typeof registerFormSchema>
): Promise<{ error: string | null }> {
  const fields = registerFormSchema.safeParse(values);

  if (!fields.success) return { error: 'Invalid Fields' };

  const { email, password, username } = fields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await getUserByEmail(email);
  if (user) return { error: 'Email already in use!' };

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
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
}
