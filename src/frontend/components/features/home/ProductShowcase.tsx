'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Tag } from 'lucide-react'
import { useProducts } from '@/frontend/hooks/useProducts'
import type { ProductWithVariants } from '@/backend/features/products/models/product.model'

const ACCENT = '#e8783a'

function getLowestPrice(product: ProductWithVariants) {
  const active = product.variants.filter(v => v.active)
  if (active.length === 0) return { from: null, original: null, hasSale: false }
  const hasSale = active.some(v => v.sale_price != null)
  const from = hasSale
    ? Math.min(...active.filter(v => v.sale_price != null).map(v => v.sale_price!))
    : Math.min(...active.map(v => v.price))
  const original = hasSale ? Math.min(...active.map(v => v.price)) : null
  return { from, original, hasSale }
}

function FeaturedPanel({
  product,
  isSingle,
}: {
  product: ProductWithVariants
  isSingle: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const { from, original, hasSale } = getLowestPrice(product)

  const images: string[] = (product as any).image_urls?.length
    ? (product as any).image_urls
    : product.image_url ? [product.image_url] : []

  return (
    <Link
      href={`/productos/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: isSingle ? '1 1 100%' : '0 0 clamp(280px, calc(100% / 2.2), 560px)',
        height: 'clamp(300px, 42vw, 460px)',
        position: 'relative',
        overflow: 'hidden',
        display: 'block',
        textDecoration: 'none',
        scrollSnapAlign: 'start',
        flexShrink: 0,
      }}
    >
      {/* Image */}
      {images.length > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={images[0]}
          alt={product.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 80%, rgba(196,98,45,0.2), rgba(15,7,2,0.98))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 900,
            color: 'rgba(196,98,45,0.12)',
            letterSpacing: '-0.02em',
          }}>
            {product.name}
          </span>
        </div>
      )}

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(8,3,1,0.88) 0%, rgba(8,3,1,0.35) 45%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to right, rgba(8,3,1,0.5) 0%, transparent 60%)`,
        pointerEvents: 'none',
        opacity: hovered ? 0.6 : 0.4,
        transition: 'opacity 0.4s',
      }} />

      {/* Accent bottom line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: hovered
          ? `linear-gradient(to right, ${ACCENT}, rgba(232,120,58,0.4))`
          : 'transparent',
        transition: 'background 0.4s ease',
      }} />

      {/* Content */}
      <div className="fp-content" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 'clamp(1.25rem, 3vw, 2.25rem)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem',
      }}>
        {/* Left: name + desc */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {hasSale && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: '#ef4444', color: 'white',
              fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px',
              borderRadius: '3px', marginBottom: '0.5rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              <Tag size={8} /> OFERTA
            </div>
          )}
          <div style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(1.6rem, 4.5vw, 2.75rem)',
            fontWeight: 900,
            color: '#f5e6d3',
            lineHeight: 1.0,
            textShadow: '0 2px 24px rgba(0,0,0,0.6)',
            letterSpacing: '-0.01em',
          }}>
            {product.name}
          </div>
          {product.description && (
            <div style={{
              color: 'rgba(196,168,130,0.6)',
              fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
              marginTop: '0.3rem',
              maxWidth: '300px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}>
              {product.description}
            </div>
          )}
        </div>

        {/* Right: price + CTA */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {from != null && (
            <div style={{ marginBottom: '0.6rem' }}>
              {hasSale && original && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '2px' }}>
                  <span style={{
                    color: 'rgba(245,230,211,0.65)',
                    fontSize: '0.85rem',
                    textDecoration: 'line-through',
                    textDecorationColor: 'rgba(239,68,68,0.7)',
                    fontWeight: 500,
                  }}>
                    ${original.toLocaleString('es-AR')}
                  </span>
                  {original > 0 && (
                    <span style={{
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: '3px',
                      letterSpacing: '0.05em',
                    }}>
                      -{Math.round((1 - from / original) * 100)}%
                    </span>
                  )}
                </div>
              )}
              <div style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.3rem)',
                fontWeight: 800,
                color: ACCENT,
                textShadow: '0 0 20px rgba(232,120,58,0.3)',
              }}>
                Desde ${from.toLocaleString('es-AR')}
              </div>
            </div>
          )}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            color: hovered ? '#f5e6d3' : 'rgba(245,230,211,0.55)',
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
            borderBottom: `1px solid ${hovered ? ACCENT : 'rgba(245,230,211,0.2)'}`,
            paddingBottom: '1px',
            transition: 'all 0.3s',
          }}>
            Ver detalle <ArrowRight size={11} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ProductShowcase() {
  const { products, isLoading } = useProducts()
  const scrollRef = useRef<HTMLDivElement>(null)
  const featured = products.filter(p => p.featured && p.active)

  if (!isLoading && featured.length === 0) return null

  return (
    <section id="modelos" style={{
      background: '#0f0702',
      paddingTop: 'clamp(4rem, 8vw, 6rem)',
      paddingBottom: 'clamp(3rem, 6vw, 5rem)',
      position: 'relative',
      overflowX: 'clip',
    }}>
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        style={{
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.6rem' }}>
          <div style={{ width: '40px', height: '1px', background: 'rgba(196,98,45,0.6)', flexShrink: 0 }} />
          <span style={{
            color: 'rgba(196,98,45,0.7)',
            fontSize: '0.62rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>
            Colección
          </span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 900,
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #f5e6d3 0%, #d4a55a 60%, #e8783a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          paddingBottom: '0.08em',
          filter: 'drop-shadow(0 0 40px rgba(196,98,45,0.2))',
        }}>
          Destacados
        </h2>
      </motion.div>

      {/* Filmstrip */}
      {isLoading ? (
        <div style={{
          display: 'flex', gap: '2px',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
        }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              flex: '0 0 min(600px, 82vw)', height: 'clamp(300px, 42vw, 460px)',
              background: 'rgba(45,26,14,0.3)', borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '2px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
            paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
            scrollPaddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
          }}
        >
          {featured.map(p => (
            <FeaturedPanel
              key={p.id}
              product={p}
              isSingle={featured.length === 1}
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
          display: 'flex',
          justifyContent: 'center',
          padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 5vw, 4rem) 0',
        }}
      >
        <Link href="/productos" style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          color: '#c4a882',
          textDecoration: 'none',
          fontSize: '0.8rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
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
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        div::-webkit-scrollbar { display: none; }
        @media (max-width: 480px) {
          .fp-content {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
          .fp-content > div:last-child {
            text-align: left !important;
          }
        }
      `}</style>
    </section>
  )
}
