import React from 'react'
import { Inter } from 'next/font/google'
import './styles.css'

// Self-hosted variable Inter, so every visitor gets the same font and the in-between weights (650, 750) render as written.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata = {
  title: 'People10 — Engineering the Intelligent Enterprise',
  description: 'Modernize core systems, build what is next, and apply AI where it creates measurable impact.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
