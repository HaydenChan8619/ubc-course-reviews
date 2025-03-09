//@ts-nocheck
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UBC Course Reviews',
  description: 'Course Reviews by Students, for Students.',
  icons: '/favicon.ico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
  return (
    <>
      <html lang="en" suppressHydrationWarning>
          <body className="min-h-screen flex flex-col">
              <GoogleAnalytics gaId={googleTagId}></GoogleAnalytics>
              <link rel="icon" href="/favicon.ico" />
          <main className="min-h-screen flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </main>
          </body>
      </html>
    </>
  );
}