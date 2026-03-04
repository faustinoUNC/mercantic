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
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(4rem, 10vw, 7rem)',
          fontWeight: 900,
          background: `linear-gradient(135deg, ${accentColor}, #d4a55a)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity: 0.22,
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
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Main image — fills all space above thumbnail strip */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={images[current]}
          alt={`${productName} — imagen ${current + 1}`}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            borderRadius: images.length > 1 ? '14px 14px 0 0' : '14px',
            animation: 'galleryFadeIn 0.25s ease',
          }}
        />

        {/* Arrows — only when multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              style={{
                position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(8,3,1,0.7)', border: '1px solid rgba(196,98,45,0.25)',
                backdropFilter: 'blur(4px)',
                borderRadius: '50%', width: '34px', height: '34px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#f5e6d3', zIndex: 4,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(196,98,45,0.4)'
                e.currentTarget.style.borderColor = 'rgba(196,98,45,0.6)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(8,3,1,0.7)'
                e.currentTarget.style.borderColor = 'rgba(196,98,45,0.25)'
              }}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={next}
              style={{
                position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(8,3,1,0.7)', border: '1px solid rgba(196,98,45,0.25)',
                backdropFilter: 'blur(4px)',
                borderRadius: '50%', width: '34px', height: '34px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#f5e6d3', zIndex: 4,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(196,98,45,0.4)'
                e.currentTarget.style.borderColor = 'rgba(196,98,45,0.6)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(8,3,1,0.7)'
                e.currentTarget.style.borderColor = 'rgba(196,98,45,0.25)'
              }}
            >
              <ChevronRight size={15} />
            </button>

            {/* Counter pill */}
            <div style={{
              position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 4,
              background: 'rgba(8,3,1,0.65)', backdropFilter: 'blur(4px)',
              border: '1px solid rgba(196,98,45,0.2)',
              borderRadius: '100px', padding: '3px 10px',
              color: '#c4a882', fontSize: '0.7rem', fontWeight: 600,
              letterSpacing: '0.05em',
            }}>
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{
          flexShrink: 0,
          display: 'flex',
          gap: '4px',
          padding: '4px',
          background: 'rgba(8,3,1,0.6)',
          borderRadius: '0 0 14px 14px',
          borderTop: '1px solid rgba(92,53,32,0.25)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setCurrent(i)}
              style={{
                flex: '0 0 auto',
                width: '56px', height: '42px',
                padding: 0, border: 'none', cursor: 'pointer',
                borderRadius: '5px', overflow: 'hidden',
                outline: i === current ? `2px solid ${accentColor}` : '2px solid transparent',
                outlineOffset: '1px',
                opacity: i === current ? 1 : 0.45,
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (i !== current) e.currentTarget.style.opacity = '0.75' }}
              onMouseLeave={e => { if (i !== current) e.currentTarget.style.opacity = '0.45' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`miniatura ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes galleryFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
