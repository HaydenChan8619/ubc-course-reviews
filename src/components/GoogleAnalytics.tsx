// components/GoogleAnalytics.tsx
'use client';

import Head from 'next/head';

export function GoogleAnalytics() {
  return (
    <Head>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-V6HMZLYRE9"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V6HMZLYRE9');
          `,
        }}
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}