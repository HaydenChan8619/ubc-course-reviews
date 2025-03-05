// components/GoogleAnalytics.tsx
'use client';

import Head from 'next/head';
import Script from 'next/script';

export function GoogleAnalytics() {
const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
  return (
    <Head>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}></Script>
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleTagId}');
          `,
        }}
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}