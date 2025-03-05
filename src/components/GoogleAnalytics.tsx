// components/GoogleAnalytics.tsx
'use client';

import Head from 'next/head';

export function GoogleAnalytics() {
const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
  return (
    <Head>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}></script>
      <script
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