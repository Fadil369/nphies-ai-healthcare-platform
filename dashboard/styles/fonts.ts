import localFont from 'next/font/local'

export const inter = localFont({
  src: [
    {
      path: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
      weight: '100 900',
      style: 'normal'
    },
    {
      path: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-italic.woff2',
      weight: '100 900',
      style: 'italic'
    }
  ],
  variable: '--font-inter',
  display: 'swap'
})

export const jetBrainsMono = localFont({
  src: [
    {
      path: '../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
      weight: '100 800',
      style: 'normal'
    },
    {
      path: '../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-italic.woff2',
      weight: '100 800',
      style: 'italic'
    }
  ],
  variable: '--font-jetbrains',
  display: 'swap'
})
