'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Tag, SlidersHorizontal } from 'lucide-react'
import { CardImageCarousel } from './CardImageCarousel'
import { formatPrice } from '@/lib/utils/formatting'
import type { ProductWithVariants } from '@/backend/features/products/models/product.model'

const ORANGE = '#e8783a'
const GOLD   = '#d4a55a'
const RUST   = '#c4622d'

type SortKey = 'default' | 'price_asc' | 'price_desc'

function getLowestPrice(p: ProductWithVariants) {
  const active = p.variants.filter(v => v.active)
  if (!active.length) return null
  return Math.min(...active.map(v => v.sale_price ?? v.price))
}

function sortProducts(products: ProductWithVariants[], sort: SortKey) {
  const arr = [...products]
  if (sort === 'price_asc')
    return arr.sort((a, b) => (getLowestPrice(a) ?? Infinity) - (getLowestPrice(b) ?? Infinity))
  if (sort === 'price_desc')
    return arr.sort((a, b) => (getLowestPrice(b) ?? -Infinity) - (getLowestPrice(a) ?? -Infinity))
  return arr
}

// ── Card ──────────────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: ProductWithVariants }) {
  const [hovered, setHovered] = useState(false)

  const active      = product.variants.filter(v => v.active)
  const prices      = active.map(v => v.sale_price ?? v.price)
  const priceFrom   = prices.length ? Math.min(...prices) : null
  const hasOffer    = active.some(v => v.sale_price != null)
  const originalMin = hasOffer ? Math.min(...active.map(v => v.price)) : null
  const images: string[] = product.image_urls?.length
    ? product.image_urls
    : product.image_url ? [product.image_url] : []

  const sizes  = [...new Set(active.map(v => v.size))].sort()
  const colors = [...new Set(active.map(v => v.color))]

  return (
    <motion.div
      variants={{
        hidden:   { opacity: 0, y: 28 },
        visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        exit:     { opacity: 0, y: 16, transition: { duration: 0.3 } },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   'linear-gradient(160deg, #2a1810 0%, #160c06 100%)',
        border:       `1px solid ${hovered ? 'rgba(196,98,45,0.55)' : 'rgba(92,53,32,0.35)'}`,
        borderRadius: '12px',
        overflow:     'hidden',
        transform:    hovered ? 'translateY(-6px)' : 'translateY(0px)',
        boxShadow:    hovered
          ? `0 24px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(196,98,45,0.15), 0 0 50px rgba(196,98,45,0.07)`
          : `0 4px 24px rgba(0,0,0,0.3)`,
        transition:   'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease, border-color 0.3s ease',
        willChange:   'transform',
      }}
    >
      <Link href={`/productos/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>

        {/* ── Image ─────────────────────────────────────────────────────── */}
        <div style={{
          aspectRatio: '4/3',
          position:    'relative',
          overflow:    'hidden',
          background:  `radial-gradient(ellipse at 50% 85%, rgba(196,98,45,0.12), rgba(15,7,2,0.97))`,
        }}>
          {images.length > 0 ? (
            <div style={{
              position:   'absolute', inset: 0,
              transform:  hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}>
              <CardImageCarousel images={images} alt={product.name} />
            </div>
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: '3rem', fontWeight: 900,
                color: 'rgba(196,98,45,0.07)', letterSpacing: '-0.02em',
              }}>
                {product.name}
              </span>
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div style={{
            position:       'absolute', inset: 0, pointerEvents: 'none',
            background:     'linear-gradient(to top, rgba(22,12,6,0.65) 0%, transparent 55%)',
          }} />

          {/* Badges */}
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {hasOffer && (
              <span style={{
                background:    'linear-gradient(135deg, #ef4444, #dc2626)',
                color:         'white',
                fontSize:      '0.6rem', fontWeight: 700,
                padding:       '0.28rem 0.6rem',
                borderRadius:  '4px',
                display:       'inline-flex', alignItems: 'center', gap: '4px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                boxShadow:     '0 2px 8px rgba(239,68,68,0.35)',
              }}>
                <Tag size={8} /> OFERTA
              </span>
            )}
            {product.is_new && (
              <span style={{
                display:        'inline-flex', alignItems: 'center', gap: '5px',
                background:     'rgba(8,3,1,0.68)',
                backdropFilter: 'blur(6px)',
                border:         '1px solid rgba(232,120,58,0.38)',
                padding:        '0.28rem 0.65rem 0.28rem 0.55rem',
                borderRadius:   '4px',
              }}>
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: ORANGE, flexShrink: 0,
                  animation: 'pgPing 1.8s ease-out infinite',
                }} />
                <span style={{
                  fontSize: '0.58rem', fontWeight: 700,
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  color: '#f5e6d3',
                }}>
                  Nuevo
                </span>
              </span>
            )}
          </div>

          {/* Accent bottom line on hover */}
          <div style={{
            position:   'absolute', bottom: 0, left: 0, right: 0, height: '2px',
            background: hovered
              ? `linear-gradient(to right, ${RUST}, ${ORANGE}, rgba(232,120,58,0.15))`
              : 'transparent',
            transition: 'background 0.45s ease',
          }} />
        </div>

        {/* ── Content ───────────────────────────────────────────────────── */}
        <div style={{ padding: '1.35rem 1.5rem 1.5rem' }}>

          {/* Name */}
          <h2 style={{
            fontFamily:    'var(--font-playfair), Georgia, serif',
            fontSize:      '1.45rem',
            fontWeight:    900,
            color:         '#f5e6d3',
            marginBottom:  '0.4rem',
            lineHeight:    1.1,
            letterSpacing: '-0.01em',
          }}>
            {product.name}
          </h2>

          {/* Description */}
          {product.description && (
            <p style={{
              color:            '#6b4e38',
              fontSize:         '0.82rem',
              lineHeight:       1.55,
              marginBottom:     '1rem',
              overflow:         'hidden',
              display:          '-webkit-box',
              WebkitLineClamp:  2,
              WebkitBoxOrient:  'vertical',
            }}>
              {product.description}
            </p>
          )}

          {/* Variant tags */}
          {(sizes.length > 0 || colors.length > 0) && (
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
              {sizes.map(s => (
                <span key={s} style={{
                  background:    'rgba(92,53,32,0.15)',
                  border:        '1px solid rgba(92,53,32,0.3)',
                  color:         '#7a5c44',
                  padding:       '0.18rem 0.55rem',
                  borderRadius:  '100px',
                  fontSize:      '0.67rem',
                  letterSpacing: '0.05em',
                }}>
                  {s.replace('.', ',')}
                </span>
              ))}
              {colors.map(c => (
                <span key={c} style={{
                  background:    'rgba(92,53,32,0.15)',
                  border:        '1px solid rgba(92,53,32,0.3)',
                  color:         '#7a5c44',
                  padding:       '0.18rem 0.55rem',
                  borderRadius:  '100px',
                  fontSize:      '0.67rem',
                  letterSpacing: '0.05em',
                }}>
                  {c === 'oxido' ? 'Óxido' : c.charAt(0).toUpperCase() + c.slice(1)}
                </span>
              ))}
            </div>
          )}

          {/* Price + CTA */}
          <div style={{
            display:      'flex',
            justifyContent: 'space-between',
            alignItems:   'center',
            borderTop:    '1px solid rgba(92,53,32,0.18)',
            paddingTop:   '1.1rem',
          }}>
            {/* Price block */}
            <div>
              {priceFrom !== null ? (
                <>
                  <div style={{
                    color: '#4a2c1a', fontSize: '0.6rem',
                    letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1px',
                  }}>
                    Desde
                  </div>
                  {hasOffer && originalMin !== null && (
                    <div style={{ color: '#4a2c1a', fontSize: '0.75rem', textDecoration: 'line-through' }}>
                      {formatPrice(originalMin)}
                    </div>
                  )}
                  <div style={{
                    fontFamily:           'var(--font-playfair), Georgia, serif',
                    fontSize:             '1.25rem', fontWeight: 800,
                    background:           `linear-gradient(135deg, ${ORANGE}, ${GOLD})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor:  'transparent',
                    backgroundClip:       'text',
                  }}>
                    {formatPrice(priceFrom)}
                  </div>
                </>
              ) : (
                <div style={{ color: '#5c3520', fontSize: '0.8rem' }}>Consultar</div>
              )}
            </div>

            {/* CTA */}
            <div style={{
              display:        'inline-flex', alignItems: 'center', gap: '6px',
              background:     hovered ? 'rgba(196,98,45,0.2)' : 'rgba(196,98,45,0.08)',
              border:         `1px solid ${hovered ? 'rgba(196,98,45,0.55)' : 'rgba(196,98,45,0.25)'}`,
              color:          hovered ? '#f5e6d3' : '#b07a54',
              padding:        '0.6rem 1.1rem',
              borderRadius:   '6px',
              fontWeight:     600,
              fontSize:       '0.72rem',
              letterSpacing:  '0.1em',
              textTransform:  'uppercase',
              transition:     'all 0.3s ease',
              whiteSpace:     'nowrap',
            }}>
              Ver detalle <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </Link>

      <style>{`
        @keyframes pgPing {
          0%   { box-shadow: 0 0 0 0 rgba(232,120,58,0.6); }
          70%  { box-shadow: 0 0 0 6px rgba(232,120,58,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,120,58,0); }
        }
      `}</style>
    </motion.div>
  )
}

// ── Sort bar ──────────────────────────────────────────────────────────────────

function SortBar({
  sort, setSort, count,
}: {
  sort: SortKey
  setSort: (s: SortKey) => void
  count: number
}) {
  const OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'default',    label: 'Destacados' },
    { key: 'price_asc',  label: 'Menor precio' },
    { key: 'price_desc', label: 'Mayor precio' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:            '1rem',
        flexWrap:       'wrap',
        marginBottom:   '2.5rem',
        padding:        '0.85rem 1.1rem',
        background:     'rgba(30,15,7,0.6)',
        border:         '1px solid rgba(92,53,32,0.25)',
        borderRadius:   '8px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{
        display:     'flex', alignItems: 'center', gap: '8px',
        color:       '#5c3520',
      }}>
        <SlidersHorizontal size={13} />
        <span style={{
          fontSize: '0.68rem', letterSpacing: '0.14em',
          textTransform: 'uppercase', fontWeight: 600,
        }}>
          {count} modelo{count !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.3rem' }}>
        {OPTIONS.map(o => (
          <SortButton key={o.key} active={sort === o.key} onClick={() => setSort(o.key)}>
            {o.label}
          </SortButton>
        ))}
      </div>
    </motion.div>
  )
}

function SortButton({
  active, onClick, children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:    active ? 'rgba(196,98,45,0.18)' : hov ? 'rgba(92,53,32,0.15)' : 'transparent',
        border:        `1px solid ${active ? 'rgba(196,98,45,0.5)' : hov ? 'rgba(92,53,32,0.45)' : 'rgba(92,53,32,0.22)'}`,
        color:         active ? '#d4a55a' : hov ? '#c4a882' : '#6b4e38',
        padding:       '0.35rem 0.85rem',
        borderRadius:  '5px',
        fontSize:      '0.68rem',
        fontWeight:    600,
        letterSpacing: '0.06em',
        cursor:        'pointer',
        transition:    'all 0.22s ease',
      }}
    >
      {children}
    </button>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function ProductGrid({ products }: { products: ProductWithVariants[] }) {
  const [sort, setSort] = useState<SortKey>('default')
  const sorted = sortProducts(products, sort)

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '3.5rem 2rem 5rem' }}>
      <SortBar sort={sort} setSort={setSort} count={products.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={sort}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap:                 '1.5rem',
          }}
        >
          {sorted.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#5c3520', fontSize: '0.9rem' }}>
          No hay productos disponibles por el momento.
        </div>
      )}
    </div>
  )
}
