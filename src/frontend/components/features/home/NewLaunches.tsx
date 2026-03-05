'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '@/frontend/hooks/useProducts'
import type { ProductWithVariants } from '@/backend/features/products/models/product.model'

const ORANGE = '#e8783a'
const GOLD   = '#d4a55a'

function getLowestPrice(product: ProductWithVariants) {
  const active = product.variants.filter(v => v.active)
  if (!active.length) return null
  const hasSale = active.some(v => v.sale_price != null)
  return hasSale
    ? Math.min(...active.filter(v => v.sale_price != null).map(v => v.sale_price!))
    : Math.min(...active.map(v => v.price))
}

// ── Card (landscape, same proportions as Destacados) ─────────────────────────

function NewCard({
  product,
  index,
  isSingle,
}: {
  product: ProductWithVariants
  index: number
  isSingle: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const from   = getLowestPrice(product)
  const images: string[] = product.image_urls?.length
    ? product.image_urls
    : product.image_url ? [product.image_url] : []

  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: isSingle ? '1 1 100%' : '0 0 clamp(280px, calc(100% / 2.2), 560px)',
        height: 'clamp(300px, 42vw, 450px)',
        position: 'relative',
        overflow: 'hidden',
        display: 'block',
        scrollSnapAlign: 'start',
        flexShrink: 0,
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/productos/${product.slug}`} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>

        {/* ── Image ───────────────────────────────────────────────────── */}
        {images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[0]}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 50% 80%, rgba(196,98,45,0.2), rgba(10,4,1,0.98))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900,
              color: 'rgba(196,98,45,0.1)', letterSpacing: '-0.02em',
            }}>
              {product.name}
            </span>
          </div>
        )}

        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(8,3,1,0.9) 0%, rgba(8,3,1,0.3) 50%, transparent 100%)',
        }} />
        {/* Side gradient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `linear-gradient(to right, rgba(8,3,1,0.55) 0%, transparent 65%)`,
          opacity: hovered ? 0.65 : 0.45,
          transition: 'opacity 0.4s',
        }} />

        {/* ── ESTRENO badge ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: index * 0.18 + 0.55 }}
          style={{
            position: 'absolute', top: '1.25rem', left: '1.25rem',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}
        >
          {/* Pulsing dot */}
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: ORANGE,
            boxShadow: `0 0 0 0 rgba(232,120,58,0.5)`,
            animation: 'nlPing 1.8s ease-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '0.6rem', fontWeight: 800,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#f5e6d3',
            background: 'rgba(8,3,1,0.65)',
            padding: '4px 10px 3px',
            backdropFilter: 'blur(4px)',
            border: `1px solid rgba(232,120,58,0.35)`,
          }}>
            Estreno
          </span>
        </motion.div>

        {/* Accent bottom line — appears on hover */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: hovered
            ? `linear-gradient(to right, ${ORANGE}, rgba(232,120,58,0.3))`
            : 'transparent',
          transition: 'background 0.4s',
        }} />

        {/* ── Content ────────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(1.25rem, 3vw, 2rem)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem',
        }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(1.6rem, 4.5vw, 2.75rem)',
              fontWeight: 900, lineHeight: 1.0,
              letterSpacing: '-0.01em', color: '#f5e6d3',
              textShadow: '0 2px 24px rgba(0,0,0,0.6)',
            }}>
              {product.name}
            </div>
            {product.description && (
              <div style={{
                color: 'rgba(196,168,130,0.55)',
                fontSize: 'clamp(0.72rem, 1.4vw, 0.82rem)',
                marginTop: '0.3rem', maxWidth: '280px',
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
              }}>
                {product.description}
              </div>
            )}
          </div>

          {/* Right */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {from != null && (
              <div style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.25rem)',
                fontWeight: 800, color: ORANGE,
                textShadow: `0 0 20px rgba(232,120,58,0.3)`,
                marginBottom: '0.55rem',
              }}>
                Desde ${from.toLocaleString('es-AR')}
              </div>
            )}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              color: hovered ? '#f5e6d3' : 'rgba(245,230,211,0.5)',
              fontSize: '0.7rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', fontWeight: 600,
              borderBottom: `1px solid ${hovered ? ORANGE : 'rgba(245,230,211,0.2)'}`,
              paddingBottom: '1px', transition: 'all 0.3s',
            }}>
              Ver detalle <ArrowRight size={11} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function NewLaunches() {
  const headerRef    = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })
  const { products, isLoading } = useProducts()
  const newProducts  = products.filter(p => p.is_new && p.active)

  if (!isLoading && newProducts.length === 0) return null

  return (
    <section style={{
      background: '#0f0702',
      paddingTop: 'clamp(4rem, 8vw, 6rem)',
      paddingBottom: 'clamp(3rem, 6vw, 5rem)',
      position: 'relative',
      overflowX: 'clip',
    }}>
      {/* Separator line from hero */}
      <div style={{
        position: 'absolute', top: 0, left: 'clamp(1.5rem, 5vw, 4rem)', right: 'clamp(1.5rem, 5vw, 4rem)',
        height: '1px',
        background: `linear-gradient(to right, transparent, rgba(232,120,58,0.25), transparent)`,
      }} />

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div ref={headerRef} style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)', marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          {/* Overline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.6rem' }}>
            <div style={{ width: '40px', height: '1px', background: `rgba(196,98,45,0.6)`, flexShrink: 0 }} />
            <span style={{
              color: `rgba(196,98,45,0.7)`, fontSize: '0.62rem',
              letterSpacing: '0.35em', textTransform: 'uppercase',
              fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              Recién llegado
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900, lineHeight: 1.0,
            letterSpacing: '-0.02em',
            background: `linear-gradient(135deg, #f5e6d3 0%, ${GOLD} 60%, ${ORANGE} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            paddingBottom: '0.08em',
            filter: 'drop-shadow(0 0 40px rgba(196,98,45,0.2))',
          }}>
            Nuevos Lanzamientos
          </h2>
        </motion.div>
      </div>

      {/* ── Filmstrip ─────────────────────────────────────────────────── */}
      {isLoading ? (
        <div style={{ display: 'flex', gap: '2px', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              flex: '0 0 min(560px, 80vw)', height: 'clamp(300px, 42vw, 450px)',
              background: 'rgba(45,26,14,0.3)', borderRadius: '4px',
              animation: 'nlPulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          gap: '2px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
          scrollPaddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
        }}>
          {newProducts.map((p, i) => (
            <NewCard
              key={p.id}
              product={p}
              index={i}
              isSingle={newProducts.length === 1}
            />
          ))}
        </div>
      )}

      {/* Footer link */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          display: 'flex', justifyContent: 'center',
          padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 5vw, 4rem) 0',
        }}
      >
        <Link href="/productos" style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          color: '#c4a882', textDecoration: 'none',
          fontSize: '0.8rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 600,
          padding: '0.75rem 1.75rem',
          border: '1px solid rgba(196,98,45,0.3)',
          borderRadius: '4px',
          background: 'rgba(196,98,45,0.06)',
          transition: 'all 0.3s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#f5e6d3'
            e.currentTarget.style.borderColor = 'rgba(196,98,45,0.6)'
            e.currentTarget.style.background = 'rgba(196,98,45,0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#c4a882'
            e.currentTarget.style.borderColor = 'rgba(196,98,45,0.3)'
            e.currentTarget.style.background = 'rgba(196,98,45,0.06)'
          }}
        >
          Ver todos los modelos <ArrowRight size={14} />
        </Link>
      </motion.div>

      <style>{`
        @keyframes nlPulse { 0%,100%{opacity:.4} 50%{opacity:.7} }
        @keyframes nlPing {
          0%   { box-shadow: 0 0 0 0 rgba(232,120,58,0.55); }
          70%  { box-shadow: 0 0 0 7px rgba(232,120,58,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,120,58,0); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
