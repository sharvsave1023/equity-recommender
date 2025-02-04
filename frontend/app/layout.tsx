import { Inter } from 'next/font/google'
import { NavigationProvider } from '@/components/navigation-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black min-h-screen`}>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </body>
    </html>
  )
}

