'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import type { ProductVariant } from '@/backend/features/products/models/product.model'
import { useCart } from '@/frontend/context/CartContext'

const COLOR_LABELS: Record<string, string> = { negro: 'Negro', oxido: 'Óxido' }
const COLOR_SWATCHES: Record<string, string> = { negro: '#1a1a1a', oxido: '#8B4513' }

interface ProductInfo {
  id: string
  name: string
  slug: string
}

interface VariantSelectorProps {
  variants: ProductVariant[]
  includes?: string[]
  productInfo?: ProductInfo
  onVariantChange?: (variant: ProductVariant) => void
}

export function VariantSelector({ variants, includes, productInfo, onVariantChange }: VariantSelectorProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const activeVariants = variants.filter(v => v.active)
  const sizes = [...new Set(activeVariants.map(v => v.size))].sort()
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? '')

  const colorsForSize = activeVariants.filter(v => v.size === selectedSize).map(v => v.color)
  const [selectedColor, setSelectedColor] = useState(colorsForSize[0] ?? 'negro')

  // Reset color when size changes if current color not available
  useEffect(() => {
    if (!colorsForSize.includes(selectedColor)) {
      setSelectedColor(colorsForSize[0])
    }
  }, [selectedSize]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedVariant = activeVariants.find(v => v.size === selectedSize && v.color === selectedColor)

  useEffect(() => {
    if (selectedVariant) onVariantChange?.(selectedVariant)
  }, [selectedVariant]) // eslint-disable-line react-hooks/exhaustive-deps

  const hasSale = selectedVariant?.sale_price != null
  const displayPrice = selectedVariant?.sale_price ?? selectedVariant?.price ?? 0
  const originalPrice = selectedVariant?.price ?? 0
  const discountPct = hasSale ? Math.round((1 - displayPrice / originalPrice) * 100) : 0

  const includesList = includes ?? []

  function handleAddToCart() {
    if (!selectedVariant || !productInfo) return
    addItem({
      variantId: selectedVariant.id,
      productId: productInfo.id,
      productName: productInfo.name,
      productSlug: productInfo.slug,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price,
      salePrice: selectedVariant.sale_price ?? null,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Size selector */}
      <div>
        <label style={{
          display: 'block', color: '#c4a882', fontSize: '0.7rem',
          letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600,
        }}>
          Tamaño
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              style={{
                flex: 1, minWidth: '80px',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: selectedSize === size ? '2px solid #c4622d' : '1px solid rgba(92, 53, 32, 0.4)',
                background: selectedSize === size ? 'rgba(196, 98, 45, 0.12)' : 'rgba(45, 26, 14, 0.5)',
                color: selectedSize === size ? '#f5e6d3' : '#c4a882',
                fontSize: '0.9rem',
                fontWeight: selectedSize === size ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedSize === size ? '0 0 12px rgba(196, 98, 45, 0.2)' : 'none',
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color selector */}
      <div>
        <label style={{
          display: 'block', color: '#c4a882', fontSize: '0.7rem',
          letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600,
        }}>
          Color — <span style={{ color: '#c4a882' }}>{COLOR_LABELS[selectedColor] ?? selectedColor}</span>
        </label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {colorsForSize.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              title={COLOR_LABELS[color] ?? color}
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: selectedColor === color ? '3px solid #c4622d' : '2px solid rgba(92, 53, 32, 0.4)',
                background: COLOR_SWATCHES[color] ?? '#888',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: selectedColor === color ? '2px solid rgba(196, 98, 45, 0.3)' : 'none',
                outlineOffset: '3px',
                boxShadow: selectedColor === color ? '0 0 16px rgba(196, 98, 45, 0.3)' : 'none',
                position: 'relative',
              }}
            >
              {color === 'oxido' && (
                <div style={{
                  position: 'absolute', inset: 4, borderRadius: '50%',
                  background: 'repeating-linear-gradient(45deg, #8B4513 0px, #A0522D 4px, #6B3410 8px)',
                }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price display */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(196, 98, 45, 0.08), rgba(212, 165, 90, 0.04))',
        border: '1px solid rgba(196, 98, 45, 0.2)',
        borderRadius: '8px',
        padding: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div>
          <div style={{ color: '#c4a882', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>
            Precio final
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '1.75rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #e8783a, #d4a55a)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              ${displayPrice.toLocaleString('es-AR')}
            </div>
            {hasSale && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#c4a882', fontSize: '0.9rem', textDecoration: 'line-through' }}>
                  ${originalPrice.toLocaleString('es-AR')}
                </span>
                <span style={{
                  background: '#ef4444', color: 'white',
                  fontSize: '0.65rem', fontWeight: 700, padding: '1px 5px', borderRadius: '4px',
                }}>
                  -{discountPct}%
                </span>
              </div>
            )}
          </div>
          <div style={{ color: '#c4a882', fontSize: '0.75rem', marginTop: '2px' }}>ARS · Transferencia / Efectivo / MP</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#c4a882', fontSize: '0.75rem' }}>{selectedSize}</div>
          <div style={{ color: '#c4a882', fontSize: '0.75rem' }}>{COLOR_LABELS[selectedColor] ?? selectedColor}</div>
          {includesList.length > 0 && (
            <div style={{ color: '#c4a882', fontSize: '0.7rem', marginTop: '4px' }}>
              Incluye: {includesList.join(' + ')}
            </div>
          )}
        </div>
      </div>

      {/* Add to cart button — only when productInfo is provided */}
      {productInfo && (
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            background: added
              ? 'linear-gradient(135deg, #16a34a, #22c55e)'
              : 'linear-gradient(135deg, #c4622d, #e8783a)',
            color: '#f5e6d3',
            padding: '1rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: selectedVariant ? 'pointer' : 'not-allowed',
            opacity: selectedVariant ? 1 : 0.5,
            boxShadow: added
              ? '0 0 30px rgba(22, 163, 74, 0.3)'
              : '0 0 30px rgba(196, 98, 45, 0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          {added ? <><Check size={18} /> Agregado al carrito</> : <><ShoppingBag size={18} /> Agregar al carrito</>}
        </button>
      )}
    </div>
  )
}
