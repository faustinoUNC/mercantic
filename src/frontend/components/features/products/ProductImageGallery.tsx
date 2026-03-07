'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

interface Props {
  images: string[]
  productName: string
  accentColor: string
  glow: string
}

export function ProductImageGallery({ images, productName, accentColor, glow }: Props) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [objPos, setObjPos] = useState({ x: 50, y: 50 })

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length)
  const next = () => setCurrent(c => (c + 1) % images.length)

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setLightbox(false); setZoomed(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

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

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Main image */}
        <div
          style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0, cursor: 'zoom-in' }}
          onClick={() => { setLightbox(true); setZoomed(false) }}
        >
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

          {/* Zoom hint */}
          <div style={{
            position: 'absolute', bottom: '0.6rem', right: '0.6rem', zIndex: 4,
            background: 'rgba(8,3,1,0.65)', backdropFilter: 'blur(4px)',
            border: '1px solid rgba(196,98,45,0.2)',
            borderRadius: '6px', padding: '4px 8px',
            display: 'flex', alignItems: 'center', gap: '4px',
            color: '#c4a882', fontSize: '0.65rem', fontWeight: 600,
            letterSpacing: '0.05em', pointerEvents: 'none',
          }}>
            <ZoomIn size={11} /> Ampliar
          </div>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev() }}
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
                onClick={e => { e.stopPropagation(); next() }}
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

              {/* Counter */}
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
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.96)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={e => { if (e.target === e.currentTarget) { setLightbox(false); setZoomed(false) } }}
        >
          {/* Close button */}
          <button
            onClick={() => { setLightbox(false); setZoomed(false) }}
            style={{
              position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 3,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%', width: '42px', height: '42px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <X size={18} />
          </button>

          {/* Hint */}
          <div style={{
            position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '0.08em',
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            {zoomed ? 'Clic para alejar · Mover el cursor para explorar' : 'Clic para ampliar'}
          </div>

          {/* Nav arrows in lightbox */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev() }}
                style={{
                  position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 3,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%', width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next() }}
                style={{
                  position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 3,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%', width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Zoomable image container */}
          <div
            style={{
              width: '100%', height: '100%',
              overflow: 'hidden',
              cursor: zoomed ? 'zoom-out' : 'zoom-in',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseMove={e => {
              if (!zoomed) return
              const rect = e.currentTarget.getBoundingClientRect()
              setObjPos({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
              })
            }}
            onClick={() => {
              setZoomed(z => !z)
              setObjPos({ x: 50, y: 50 })
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[current]}
              alt={`${productName} — ampliado`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: zoomed ? 'cover' : 'contain',
                objectPosition: zoomed ? `${objPos.x}% ${objPos.y}%` : 'center',
                transition: zoomed ? 'none' : 'object-fit 0.2s',
                userSelect: 'none',
                WebkitUserDrag: 'none',
              } as React.CSSProperties}
              draggable={false}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes galleryFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  )
}
