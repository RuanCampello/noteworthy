'use server';

import { db } from '@/db';

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    return null;
  }
}

export async function userHasProviderAccount(
  id: string
): Promise<{ value: boolean; provider?: string }> {
  const user = await db.account.findFirst({ where: { userId: id } });
  if (user) {
    const provider = user.provider;
    const fistLetter = provider.charAt(0).toUpperCase();
    const capilizedProvider = fistLetter + provider.slice(1);

    return { value: true, provider: capilizedProvider };
  }
  return { value: false };
}
