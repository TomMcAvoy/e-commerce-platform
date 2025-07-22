import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import CartSidebar from '../components/CartSidebar'
import { CartProvider } from '../contexts/CartContext'
import { ToastProvider } from '../contexts/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WhiteStartups - Shopping Online',
  description: 'Discover products through social feeds and connect with brands you love. Shop, share, and save with affiliate rewards.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <CartProvider>
            <Header />
            <main>
              {children}
            </main>
            <CartSidebar />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
