'use client'

import { VariantSelector } from './VariantSelector'
import type { ProductVariant } from '@/backend/features/products/models/product.model'

interface AddToCartSectionProps {
  productInfo: {
    id: string
    name: string
    slug: string
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
      <p style={{ color: '#c4a882', fontSize: '0.75rem', textAlign: 'center' }}>
        Envíos a todo el país · Pago en cuotas disponible
      </p>
    </div>
  )
}
