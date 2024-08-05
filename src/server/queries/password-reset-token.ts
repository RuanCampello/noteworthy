import 'server-only';

import { db } from '@/server/db';
import { passwordResetTokens } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getPasswordResetTokenByToken(token: string) {
  try {
    return await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });
  } catch (error) {
    return null;
  }
}

export async function getPasswordResetTokenByEmail(email: string) {
  try {
    return await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });
  } catch (error) {
    return null;
  }
}
