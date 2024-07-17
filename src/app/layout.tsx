import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { type ReactNode } from 'react';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" spellCheck={false}>
      <body
        className={`${sourceSans.className} bg-black text-neutral-100 text-base`}
      >
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
