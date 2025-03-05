import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UBC Course Reviews',
  description: 'Course Reviews by Students, for Students.',
  icons: '/logo.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleAnalytics />
      <html lang="en" suppressHydrationWarning>
          <body className="min-h-screen flex flex-col">
          <main className="min-h-screen flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </main>
          </body>
      </html>
    </>
  );
}