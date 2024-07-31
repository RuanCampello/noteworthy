import 'server-only';

import { drizzle as db } from '@/server/db';
import { passwordResetToken } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getPasswordResetTokenByToken(token: string) {
  try {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });
  } catch (error) {
    return null;
  }
}

export async function getPasswordResetTokenByEmail(email: string) {
  try {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });
  } catch (error) {
    return null;
  }
}
