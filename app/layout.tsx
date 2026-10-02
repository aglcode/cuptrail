import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import localFont from 'next/font/local'
import { AppHeader, AppFooter } from '@/components/app-shell'
import { JournalProvider } from '@/components/journal-provider'
import './globals.css'

const manrope = localFont({
  src: [
    { path: './fonts/manrope-0.ttf', weight: '400', style: 'normal' },
    { path: './fonts/manrope-1.ttf', weight: '500', style: 'normal' },
    { path: './fonts/manrope-2.ttf', weight: '600', style: 'normal' },
    { path: './fonts/manrope-3.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-manrope', display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Cuptrail — Find your coffee corner', template: '%s · Cuptrail' },
  description: 'Discover coffee shops, find your favorite corners, and keep a personal journal of every good brew.',
  applicationName: 'Cuptrail',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{ variables: {
          colorPrimary: 'var(--foreground)',
          colorBackground: 'var(--surface)',
          colorForeground: 'var(--foreground)',
          colorMutedForeground: 'var(--muted)',
          colorInput: 'var(--background)',
          colorInputForeground: 'var(--foreground)',
          colorDanger: 'var(--error)',
          colorSuccess: 'var(--success)',
          colorWarning: 'var(--warning)',
          colorBorder: 'var(--control-border)',
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '1rem',
          borderRadius: '1rem',
        }, elements: {
          card: 'cuptrail-auth-card',
          formButtonPrimary: 'cuptrail-auth-button',
          formFieldInput: 'cuptrail-auth-input',
          socialButtonsBlockButton: 'cuptrail-auth-social',
          modalCloseButton: 'cuptrail-auth-close',
        } }}>
          <JournalProvider>
            <AppHeader />
            {children}
            <AppFooter />
          </JournalProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
