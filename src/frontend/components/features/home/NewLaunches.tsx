'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useProducts } from '@/frontend/hooks/useProducts'
import type { ProductWithVariants } from '@/backend/features/products/models/product.model'

const ACCENT = '#4aaee8'

function getLowestPrice(product: ProductWithVariants) {
  const active = product.variants.filter(v => v.active)
  if (active.length === 0) return null
  const hasSale = active.some(v => v.sale_price != null)
  const from = hasSale
    ? Math.min(...active.filter(v => v.sale_price != null).map(v => v.sale_price!))
    : Math.min(...active.map(v => v.price))
  return from
}

function NewCard({
  product,
  isSingle,
  index,
}: {
  product: ProductWithVariants
  isSingle: boolean
  index: number
}) {
  const images: string[] = product.image_urls?.length
    ? product.image_urls
    : product.image_url ? [product.image_url] : []

  const from = getLowestPrice(product)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      style={{
        flex: isSingle ? '1 1 100%' : '0 0 min(520px, 80vw)',
        scrollSnapAlign: 'start',
        flexShrink: 0,
      }}
    >
      <Link
        href={`/productos/${product.slug}`}
        style={{
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '6px',
          height: 'clamp(260px, 38vw, 400px)',
          textDecoration: 'none',
          border: `1px solid rgba(74,174,232,0.15)`,
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(74,174,232,0.45)'
          e.currentTarget.style.boxShadow = `0 0 40px rgba(74,174,232,0.08), 0 8px 40px rgba(0,0,0,0.4)`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(74,174,232,0.15)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {/* Image or placeholder */}
        {images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[0]}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 30% 70%, rgba(74,174,232,0.15), rgba(10,6,3,0.98))`,
          }} />
        )}

        {/* Overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(6,3,1,0.92) 0%, rgba(6,3,1,0.3) 50%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* NEW badge */}
        <div style={{
          position: 'absolute', top: '1rem', left: '1rem',
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          background: ACCENT,
          color: '#050303',
          fontSize: '0.58rem',
          fontWeight: 800,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: '3px',
        }}>
          <Sparkles size={9} />
          NUEVO
        </div>

        {/* Bottom content */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(1rem, 3vw, 1.75rem)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
              fontWeight: 900,
              color: '#f5e6d3',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              textShadow: '0 2px 20px rgba(0,0,0,0.7)',
            }}>
              {product.name}
            </div>
            {product.description && (
              <div style={{
                color: 'rgba(196,168,130,0.55)',
                fontSize: '0.78rem',
                marginTop: '0.3rem',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}>
                {product.description}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {from != null && (
              <div style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                fontWeight: 800,
                color: ACCENT,
                marginBottom: '0.5rem',
              }}>
                Desde ${from.toLocaleString('es-AR')}
              </div>
            )}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              color: 'rgba(245,230,211,0.55)',
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              borderBottom: `1px solid rgba(74,174,232,0.35)`,
              paddingBottom: '1px',
            }}>
              Ver detalle <ArrowRight size={10} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function NewLaunches() {
  const { products, isLoading } = useProducts()
  const scrollRef = useRef<HTMLDivElement>(null)
  const newProducts = products.filter(p => p.is_new && p.active)

  if (!isLoading && newProducts.length === 0) return null

  return (
    <section style={{
      background: '#0a0603',
      paddingTop: 'clamp(3.5rem, 7vw, 5.5rem)',
      paddingBottom: 'clamp(3rem, 6vw, 5rem)',
      position: 'relative',
      borderTop: '1px solid rgba(74,174,232,0.08)',
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '32px', height: '1px', background: `rgba(74,174,232,0.55)`, flexShrink: 0 }} />
            <span style={{
              color: `rgba(74,174,232,0.75)`,
              fontSize: '0.6rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <Sparkles size={10} /> Recién llegados
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(1.8rem, 4.5vw, 2.9rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            color: '#f5e6d3',
            margin: 0,
          }}>
            Nuevos Lanzamientos
          </h2>
        </div>
        <Link href="/productos" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          color: 'rgba(74,174,232,0.7)',
          textDecoration: 'none',
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          fontWeight: 600,
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(74,174,232,0.7)')}
        >
          Ver todo <ArrowRight size={12} />
        </Link>
      </motion.div>

      {/* Cards */}
      {isLoading ? (
        <div style={{ display: 'flex', gap: '12px', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              flex: '0 0 min(520px, 80vw)', height: 'clamp(260px, 38vw, 400px)',
              background: 'rgba(20,12,5,0.5)', borderRadius: '6px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '12px',
            padding: '0 clamp(1.5rem, 5vw, 4rem)',
            overflowX: newProducts.length > 1 ? 'auto' : 'hidden',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {newProducts.map((p, i) => (
            <NewCard key={p.id} product={p} isSingle={newProducts.length === 1} index={i} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.6; } }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
