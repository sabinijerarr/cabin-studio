import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroller from '@/components/SmoothScroller'
import JsonLd from '@/components/JsonLd'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '600', '700'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cabinstudio.com'),
  title: {
    default: 'Cabin Studio — Recording Studio Chicago',
    template: '%s | Cabin Studio Chicago',
  },
  description:
    'Cabin Studio is a professional recording studio in Chicago. Book sessions for recording, mixing & mastering. Starting at $75/hr. Intimate cabin-inspired environment for serious artists.',
  keywords: [
    'recording studio Chicago',
    'music studio Chicago',
    'mixing and mastering Chicago',
    'cabin studio Chicago',
    'Chicago recording studio',
    'professional recording Chicago',
    'music production Chicago',
    'hip hop studio Chicago',
    'vocal recording Chicago',
  ],
  authors: [{ name: 'Cabin Studio' }],
  openGraph: {
    title: 'Cabin Studio — Recording Studio Chicago',
    description:
      'Professional recording studio in Chicago. Recording $75/hr, Mixing & Mastering $150/song, Full Session $250/4hrs. Book your session today.',
    url: 'https://cabinstudio.com',
    siteName: 'Cabin Studio',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cabin Studio — Recording Studio Chicago',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cabin Studio — Recording Studio Chicago',
    description:
      'Book a session at Cabin Studio Chicago. Recording, mixing & mastering from $75/hr.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${jetbrains.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="bg-warm-black text-cream antialiased">
        <SmoothScroller>{children}</SmoothScroller>
      </body>
    </html>
  )
}
