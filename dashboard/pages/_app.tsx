import type { AppProps } from 'next/app'
import Head from 'next/head'
import { inter, jetBrainsMono } from '../styles/fonts'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const fontClass = `${inter.variable} ${jetBrainsMono.variable}`

  return (
    <div className={fontClass}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </div>
  )
}
