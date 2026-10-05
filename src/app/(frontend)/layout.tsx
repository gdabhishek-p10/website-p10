import React from 'react'
import './styles.css'

export const metadata = {
  title: 'People10 — Engineering the Intelligent Enterprise',
  description: 'Modernize core systems, build what is next, and apply AI where it creates measurable impact.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
