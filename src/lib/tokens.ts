import { getPasswordResetTokenByEmail } from '@/queries/password-reset-token';
import { db, drizzle } from '@/server/db';
import { passwordResetToken } from '@/server/db/schema';
import { v4 as uuid } from 'uuid';

type Token = {
  id: number;
  email: string;
  token: string;
  expires: Date;
};

export async function generatePasswordResetToken(
  email: string,
): Promise<{ currentToken?: Token; newToken?: Token }> {
  const token = uuid();
  // validity of one hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const currentToken = await getPasswordResetTokenByEmail(email);
  if (currentToken && new Date(currentToken.expires) > new Date()) {
    return { currentToken };
  } else {
    const [passwordToken] = await drizzle
      .insert(passwordResetToken)
      .values({
        email,
        token,
        expires,
      })
      .returning();

    return { newToken: passwordToken };
  }
}
