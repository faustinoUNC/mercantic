'use client'

import { MessageCircle } from 'lucide-react'
import { VariantSelector } from './VariantSelector'
import type { ProductVariant } from '@/backend/features/products/models/product.model'

interface AddToCartSectionProps {
  productInfo: {
    id: string
    name: string
    slug: string
    shape: 'round' | 'square'
  }
  variants: ProductVariant[]
  includes?: string[]
}

export function AddToCartSection({ productInfo, variants, includes }: AddToCartSectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <VariantSelector
        variants={variants}
        includes={includes}
        productInfo={productInfo}
      />
      <a
        href={`https://wa.me/5493513000000?text=Hola!%20Me%20interesa%20el%20fogonero%20${productInfo.name}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          background: 'transparent',
          border: '1px solid rgba(92, 53, 32, 0.5)',
          color: '#7a5c44',
          padding: '0.75rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.85rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.5)'
          e.currentTarget.style.color = '#25d366'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(92, 53, 32, 0.5)'
          e.currentTarget.style.color = '#7a5c44'
        }}
      >
        <MessageCircle size={16} /> Consultar por WhatsApp
      </a>
      <p style={{ color: '#3d2415', fontSize: '0.75rem', textAlign: 'center' }}>
        Envíos a todo el país · Pago en cuotas disponible
      </p>
    </div>
  )
}
