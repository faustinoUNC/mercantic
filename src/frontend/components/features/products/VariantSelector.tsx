'use client'

import { useState } from 'react'

const SIZES = ['1.25m', '1.50m'] as const
const COLORS = ['negro', 'oxido'] as const

const PRICES: Record<string, number> = {
  '1.25m': 1287000,
  '1.50m': 1405000,
}

const COLOR_LABELS: Record<string, string> = { negro: 'Negro', oxido: 'Óxido' }
const COLOR_SWATCHES: Record<string, string> = {
  negro: '#1a1a1a',
  oxido: '#8B4513',
}

interface VariantSelectorProps {
  onVariantChange?: (size: string, color: string, price: number) => void
}

export function VariantSelector({ onVariantChange }: VariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string>('1.25m')
  const [selectedColor, setSelectedColor] = useState<string>('negro')

  const price = PRICES[selectedSize]

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    onVariantChange?.(size, selectedColor, PRICES[size])
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    onVariantChange?.(selectedSize, color, price)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Size selector */}
      <div>
        <label style={{
          display: 'block',
          color: '#7a5c44',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
          fontWeight: 600,
        }}>
          Tamaño
        </label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: selectedSize === size
                  ? '2px solid #c4622d'
                  : '1px solid rgba(92, 53, 32, 0.4)',
                background: selectedSize === size
                  ? 'rgba(196, 98, 45, 0.12)'
                  : 'rgba(45, 26, 14, 0.5)',
                color: selectedSize === size ? '#f5e6d3' : '#7a5c44',
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
          display: 'block',
          color: '#7a5c44',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
          fontWeight: 600,
        }}>
          Color — <span style={{ color: '#c4a882' }}>{COLOR_LABELS[selectedColor]}</span>
        </label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              title={COLOR_LABELS[color]}
              style={{
                width: '48px', height: '48px',
                borderRadius: '50%',
                border: selectedColor === color
                  ? '3px solid #c4622d'
                  : '2px solid rgba(92, 53, 32, 0.4)',
                background: COLOR_SWATCHES[color],
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
                  position: 'absolute', inset: 4,
                  borderRadius: '50%',
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
      }}>
        <div>
          <div style={{ color: '#7a5c44', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>
            Precio final
          </div>
          <div style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '1.75rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #e8783a, #d4a55a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            ${price.toLocaleString('es-AR')}
          </div>
          <div style={{ color: '#5c3520', fontSize: '0.75rem', marginTop: '2px' }}>ARS · Transferencia / Efectivo</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#5c3520', fontSize: '0.75rem' }}>{selectedSize}</div>
          <div style={{ color: '#5c3520', fontSize: '0.75rem' }}>{COLOR_LABELS[selectedColor]}</div>
          <div style={{ color: '#5c3520', fontSize: '0.7rem', marginTop: '4px' }}>Incluye parrilla + estaca + tapa</div>
        </div>
      </div>
    </div>
  )
}
