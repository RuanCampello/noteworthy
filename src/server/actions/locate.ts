'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || 'english';
}

export async function setUserLocale(locale: string) {
  cookies().set(COOKIE_NAME, locale);
}
