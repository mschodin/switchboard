import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Toaster } from '@/components/ui/toaster'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '900'],
  variable: '--font-beVietnam',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Switchboard - API Endpoint Registry',
  description: 'Browse and discover API endpoints',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${beVietnamPro.variable} font-sans`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
