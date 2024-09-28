'use server';

import { cookies } from 'next/headers';
import { locales } from './locales';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || 'english';
}

export async function setUserLocale(locale: string) {
  cookies().set(COOKIE_NAME, locale);
}

export type Locale = (typeof locales)[number];
