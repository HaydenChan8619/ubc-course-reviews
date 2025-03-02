// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
    return (
      <Html>
        <Head>
          {googleTagId && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
              ></script>
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
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
