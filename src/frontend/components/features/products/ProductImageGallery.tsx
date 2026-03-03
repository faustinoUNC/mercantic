'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
  productName: string
  accentColor: string
  glow: string
}

export function ProductImageGallery({ images, productName, accentColor, glow }: Props) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(4rem, 10vw, 7rem)',
          fontWeight: 900,
          background: `linear-gradient(135deg, ${accentColor}, #d4a55a)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity: 0.25,
          letterSpacing: '-0.02em',
        }}>
          {productName}
        </span>
      </div>
    )
  }

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length)
  const next = () => setCurrent(c => (c + 1) % images.length)

  return (
    <>
      {/* Main image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current]}
        alt={`${productName} — imagen ${current + 1}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
      />

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            style={{
              position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(15,7,2,0.65)', border: '1px solid rgba(196,98,45,0.3)',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#f5e6d3', zIndex: 4,
              transition: 'background 0.2s',
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            style={{
              position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(15,7,2,0.65)', border: '1px solid rgba(196,98,45,0.3)',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#f5e6d3', zIndex: 4,
              transition: 'background 0.2s',
            }}
          >
            <ChevronRight size={16} />
          </button>

          {/* Dot indicators */}
          <div style={{
            position: 'absolute', bottom: '0.75rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '6px', zIndex: 4,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === current ? accentColor : 'rgba(245,230,211,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}
