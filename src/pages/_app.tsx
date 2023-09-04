import type { AppProps } from 'next/app'
import { RootState, store } from "../store";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head';
import Script from 'next/script';
import "../firebaseConfig";
import '../styles/globals.css'
import { DefaultSeo } from 'next-seo';


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {





  return (
    <Provider store={store}>
      <SessionProvider session={session}>


        <Script id="setup" strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-7ET10M0QF7" />

        <Script strategy="lazyOnload" id='analytics'>
          {`
         window.dataLayer = window.dataLayer || [];
         function gtag(){window.dataLayer.push(arguments);}
         gtag('js', new Date());

         gtag('config', 'G-7ET10M0QF7');
    `}
        </Script>

        <DefaultSeo
          title="Proactive Ideas"
          description="Ignite your passion for learning with Proactive Ideas. Join our transformative journey of joy and growth with engaging resources that empower learners worldwide"
          openGraph={{
            type: 'website',
            locale: 'en_IE',
            url: 'https://proactiveideas.co',
            siteName: 'SiteName',
          }}
        />
        <Component {...pageProps} />
      </SessionProvider >
    </Provider >

  )

}