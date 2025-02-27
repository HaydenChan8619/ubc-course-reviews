import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UBC Course Reviews',
  description: 'Course Reviews by Students, for Students.',
  icons: '/logo.png',
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col">
        <main className="min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
        </body>
    </html>
  );
}