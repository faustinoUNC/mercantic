'use client'

import { useRef } from 'react'
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

// ── Card ─────────────────────────────────────────────────────────────────────

const cardVariants = {
  hidden:  { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: { clipPath: 'inset(0 0% 0 0)',   opacity: 1 },
}

function NewCard({
  product,
  index,
  isSingle,
}: {
  product: ProductWithVariants
  index: number
  isSingle: boolean
}) {
  const ref  = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const from   = getLowestPrice(product)
  const images: string[] = product.image_urls?.length
    ? product.image_urls
    : product.image_url ? [product.image_url] : []

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{
        duration: 0.85,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        flex: isSingle ? '1 1 100%' : '0 0 clamp(260px, 28vw, 340px)',
        maxWidth: isSingle ? '480px' : undefined,
        scrollSnapAlign: 'start',
        flexShrink: 0,
      }}
    >
      <Link
        href={`/productos/${product.slug}`}
        className="new-card-link"
        style={{ display: 'block', textDecoration: 'none', position: 'relative' }}
      >
        {/* ── Image block ──────────────────────────────────────────────── */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          height: 'clamp(320px, 42vw, 480px)',
          borderTop: `1px solid rgba(232,120,58,0.2)`,
          borderLeft: `1px solid rgba(232,120,58,0.2)`,
          borderRight: `1px solid rgba(232,120,58,0.2)`,
        }}>
          {images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[0]}
              alt={product.name}
              className="new-card-img"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                transition: 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at 40% 80%, rgba(196,98,45,0.22), rgba(8,3,1,0.98))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Ghost name as placeholder */}
              <span style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(4rem, 10vw, 7rem)',
                fontWeight: 900, letterSpacing: '-0.03em',
                color: 'rgba(196,98,45,0.08)',
                userSelect: 'none',
              }}>
                {product.name}
              </span>
            </div>
          )}

          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(8,3,1,0.25) 0%, transparent 35%, rgba(8,3,1,0.55) 100%)',
          }} />

          {/* "NUEVO" stamp — rotated, positioned top-left */}
          <motion.div
            initial={{ opacity: 0, rotate: -6, scale: 0.85 }}
            animate={inView ? { opacity: 1, rotate: -6, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
            style={{
              position: 'absolute', top: '1.1rem', left: '1.1rem',
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: ORANGE,
              color: '#060200',
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              padding: '5px 11px 4px',
              boxShadow: `0 0 24px rgba(232,120,58,0.45), 0 2px 8px rgba(0,0,0,0.6)`,
            }}
          >
            ESTRENO
          </motion.div>

          {/* Subtle number index */}
          <div style={{
            position: 'absolute', bottom: '0.9rem', right: '1rem',
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '0.6rem', letterSpacing: '0.12em',
            color: 'rgba(245,230,211,0.25)',
            fontStyle: 'italic',
          }}>
            0{index + 1}
          </div>
        </div>

        {/* ── Content block ─────────────────────────────────────────────── */}
        <div style={{
          border: `1px solid rgba(232,120,58,0.2)`,
          borderTop: 'none',
          padding: 'clamp(1rem, 2.5vw, 1.4rem) clamp(1rem, 2.5vw, 1.25rem)',
          background: 'rgba(12,5,2,0.6)',
          position: 'relative',
        }}>
          {/* Thin orange line at top of content */}
          <div style={{
            position: 'absolute', top: 0, left: '1.25rem', right: '1.25rem', height: '1px',
            background: `linear-gradient(to right, ${ORANGE}, rgba(232,120,58,0.1))`,
          }} />

          {/* Product name */}
          <div style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            color: '#f5e6d3',
            marginBottom: '0.5rem',
          }}>
            {product.name}
          </div>

          {/* Short description */}
          {product.description && (
            <div style={{
              fontSize: '0.72rem',
              color: 'rgba(196,168,130,0.5)',
              lineHeight: 1.45,
              marginBottom: '0.9rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {product.description}
            </div>
          )}

          {/* Price + CTA */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem' }}>
            {from != null ? (
              <div>
                <div style={{
                  fontSize: '0.55rem', letterSpacing: '0.22em',
                  color: `rgba(212,165,90,0.6)`, textTransform: 'uppercase',
                  marginBottom: '1px',
                }}>
                  Desde
                </div>
                <div style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
                  fontWeight: 800, color: ORANGE,
                  textShadow: '0 0 18px rgba(232,120,58,0.25)',
                }}>
                  ${from.toLocaleString('es-AR')}
                </div>
              </div>
            ) : <div />}

            <div className="new-card-cta" style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              color: 'rgba(245,230,211,0.45)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderBottom: `1px solid rgba(232,120,58,0.25)`,
              paddingBottom: '1px',
              transition: 'all 0.25s',
              whiteSpace: 'nowrap',
            }}>
              Ver modelo <ArrowRight size={10} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function NewLaunches() {
  const headerRef   = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })

  const { products, isLoading } = useProducts()
  const newProducts = products.filter(p => p.is_new && p.active)

  if (!isLoading && newProducts.length === 0) return null

  return (
    <section style={{
      background: '#0b0401',
      paddingTop: 'clamp(4rem, 8vw, 6rem)',
      paddingBottom: 'clamp(3.5rem, 7vw, 5.5rem)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow from bottom */}
      <div style={{
        position: 'absolute', bottom: '-10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '80vw', height: '40vh',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(196,98,45,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Horizontal forge lines */}
      {[0.12, 0.28, 0.48].map((op, i) => (
        <div key={i} style={{
          position: 'absolute', left: 0, right: 0,
          bottom: `${8 + i * 12}%`, height: '1px',
          background: `linear-gradient(to right, transparent, rgba(196,98,45,${op * 0.18}), transparent)`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div
        ref={headerRef}
        style={{
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              marginBottom: '0.55rem',
            }}
          >
            <div style={{ width: '36px', height: '1px', background: `rgba(232,120,58,0.55)`, flexShrink: 0 }} />
            <span style={{
              color: `rgba(212,165,90,0.7)`,
              fontSize: '0.58rem',
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}>
              Recién llegado
            </span>
          </motion.div>

          {/* Title — two-line treatment */}
          <div style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '100%' }}
              animate={headerInView ? { y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 style={{ margin: 0, lineHeight: 1.0 }}>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                  fontWeight: 700,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,230,211,0.35)',
                  marginBottom: '0.1em',
                }}>
                  Nuevos
                </span>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.025em',
                  background: `linear-gradient(135deg, #f5e6d3 0%, ${GOLD} 55%, ${ORANGE} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 40px rgba(196,98,45,0.18))',
                }}>
                  Lanzamientos
                </span>
              </h2>
            </motion.div>
          </div>
        </div>

        {/* "Ver todo" — refined link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Link href="/productos" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: 'rgba(196,168,130,0.5)',
            textDecoration: 'none',
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 600,
            padding: '0.6rem 1.25rem',
            border: '1px solid rgba(232,120,58,0.18)',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#f5e6d3'
              e.currentTarget.style.borderColor = `rgba(232,120,58,0.45)`
              e.currentTarget.style.background = 'rgba(232,120,58,0.07)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(196,168,130,0.5)'
              e.currentTarget.style.borderColor = 'rgba(232,120,58,0.18)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Ver catálogo <ArrowRight size={11} />
          </Link>
        </motion.div>
      </div>

      {/* ── Cards ──────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div style={{
          display: 'flex', gap: '2px',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              flex: '0 0 clamp(260px, 28vw, 340px)',
              height: 'clamp(480px, 60vw, 580px)',
              background: 'rgba(20,8,3,0.55)',
              animation: 'nlPulse 1.6s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          gap: 'clamp(10px, 1.5vw, 16px)',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          overflowX: newProducts.length > 2 ? 'auto' : 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          alignItems: 'flex-start',
          justifyContent: newProducts.length <= 2 ? 'flex-start' : undefined,
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

      <style>{`
        @keyframes nlPulse { 0%,100%{opacity:.3} 50%{opacity:.55} }
        div::-webkit-scrollbar { display: none; }

        .new-card-link:hover .new-card-img {
          transform: scale(1.055) !important;
        }
        .new-card-link:hover .new-card-cta {
          color: #f5e6d3 !important;
          border-bottom-color: rgba(232,120,58,0.7) !important;
          gap: 8px !important;
        }
      `}</style>
    </section>
  )
}
