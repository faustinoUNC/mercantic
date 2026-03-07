import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/frontend/context/CartContext'
import { FloatingWhatsApp } from '@/frontend/components/features/FloatingWhatsApp'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'El Mercantic Fogoneros — Asadores artesanales de alta calidad',
  description:
    'Fogoneros artesanales hechos a mano, chapa de 3,2 mm. Modelos T-REX y RAPTOR. El asador que necesitás para el fuego perfecto.',
  keywords: ['fogonero', 'asador', 'artesanal', 'parrilla', 'fuego', 'asado', 'T-REX', 'RAPTOR'],
  openGraph: {
    title: 'El Mercantic Fogoneros',
    description: 'Asadores artesanales de alta calidad. Hechos a mano, para durar toda la vida.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  )
}
