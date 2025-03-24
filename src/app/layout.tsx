//@ts-nocheck
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'UBC Course Reviews',
    template: '%s - UBC Course Reviews'
  },
  description: 'UBC Course Reviews is the best place to learn more about courses at UBC, and leave your thoughts about the courses you have taken.'
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
          <main className="min-h-screen flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </main>
          </body>
      </html>
    </>
  );
}