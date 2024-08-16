import QueryProvider from '@/components/QueryProvider';
import Search from '@/components/Search';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { EB_Garamond, Source_Sans_3 } from 'next/font/google';
import { type ReactNode } from 'react';
import './globals.css';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  preload: true,
  weight: 'variable',
  variable: '--font-sans',
});

const garamound = EB_Garamond({
  preload: true,
  subsets: ['latin'],
  variable: '--font-garamound',
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
        className={`${sourceSans.variable} ${garamound.variable} font-sans bg-black text-neutral-100 text-base overflow-hidden`}
      >
        <SessionProvider>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
              <Search />
            </NextIntlClientProvider>
          </QueryProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
