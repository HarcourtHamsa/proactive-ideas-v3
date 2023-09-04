import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <Script 
      async={true}
      strategy="lazyOnload"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4009089239176699"
     crossOrigin="anonymous" 
     id='adSense'
     onError={ (e) => { console.error('Script failed to load', e) }}
     ></Script>
        </Head>
      <body>
        <Main />
        <div id="portal-root" />
        <NextScript />
      </body>
    </Html>
  )
}
