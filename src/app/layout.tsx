import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { type ReactNode } from 'react';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: 'variable',
});

export const metadata: Metadata = {
  title: {
    template: 'Noteworthy - %s',
    default: 'Noteworthy',
  },
  description: 'Note app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const lang = locale === 'portuguese' ? 'pt' : 'en';

  return (
    <html lang={lang} spellCheck={false}>
      <body
        className={`${sourceSans.className} bg-black text-neutral-100 text-base`}
      >
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
