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

export async function uploadUserProfileImage(url: string, userId: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { image: url },
    });
  } catch (error) {
    console.error(error);
  }
}
