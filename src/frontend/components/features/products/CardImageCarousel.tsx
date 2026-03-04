'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
  alt: string
}

export function CardImageCarousel({ images, alt }: Props) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) return null

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrent(c => (c - 1 + images.length) % images.length)
  }
  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrent(c => (c + 1) % images.length)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current}
        src={images[current]}
        alt={`${alt} — imagen ${current + 1}`}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          animation: 'cardImgFade 0.22s ease',
        }}
      />

      {images.length > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={prev}
            style={{
              position: 'absolute', left: '0.4rem', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(8,3,1,0.72)', border: '1px solid rgba(196,98,45,0.3)',
              backdropFilter: 'blur(4px)', borderRadius: '50%',
              width: '30px', height: '30px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#f5e6d3', zIndex: 5, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,98,45,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(8,3,1,0.72)' }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={next}
            style={{
              position: 'absolute', right: '0.4rem', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(8,3,1,0.72)', border: '1px solid rgba(196,98,45,0.3)',
              backdropFilter: 'blur(4px)', borderRadius: '50%',
              width: '30px', height: '30px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#f5e6d3', zIndex: 5, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,98,45,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(8,3,1,0.72)' }}
          >
            <ChevronRight size={14} />
          </button>

          {/* Dot indicators */}
          <div style={{
            position: 'absolute', bottom: '0.5rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '5px', zIndex: 5,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); e.stopPropagation(); setCurrent(i) }}
                style={{
                  width: i === current ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === current ? '#e8783a' : 'rgba(245,230,211,0.4)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.25s',
                }}
              />
            ))}
          </div>

          {/* Counter pill */}
          <div style={{
            position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 5,
            background: 'rgba(8,3,1,0.65)', backdropFilter: 'blur(4px)',
            border: '1px solid rgba(196,98,45,0.2)',
            borderRadius: '100px', padding: '2px 8px',
            color: '#c4a882', fontSize: '0.65rem', fontWeight: 600,
            letterSpacing: '0.05em',
          }}>
            {current + 1}/{images.length}
          </div>
        </>
      )}

      <style>{`
        @keyframes cardImgFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
