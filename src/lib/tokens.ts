import { getPasswordResetTokenByEmail } from '@/queries/password-reset-token';
import { db } from '@/server/db';
import { v4 as uuid } from 'uuid';

type Token = {
  id: string;
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
    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return { newToken: passwordResetToken };
  }
}
