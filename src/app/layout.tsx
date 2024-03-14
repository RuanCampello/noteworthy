import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: 'variable',
});

export const metadata: Metadata = {
  title: 'Noteworthy',
  description: 'Note app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' spellCheck={false}>
      <body
        className={`${sourceSans.className} bg-black text-neutral-100 text-base`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
