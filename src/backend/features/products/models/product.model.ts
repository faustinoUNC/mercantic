export type ProductShape = 'round' | 'square'
export type ProductColor = 'negro' | 'oxido'
export type ProductSize = '1.25m' | '1.50m'

export interface ProductVariant {
  id: string
  product_id: string
  size: ProductSize
  color: ProductColor
  price: number
  sale_price: number | null   // null = no offer active
  stock: number
  active: boolean
  created_at: string
}

export interface Product {
  id: string
  slug: string
  name: string
  shape: ProductShape
  description: string | null
  material: string | null
  includes: string[]
  active: boolean
  created_at: string
  variants?: ProductVariant[]
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[]
}

export interface UpdateVariantPayload {
  price?: number
  sale_price?: number | null
  stock?: number
  active?: boolean
}

export interface UpdateProductPayload {
  description?: string
  material?: string
  includes?: string[]
  active?: boolean
}
