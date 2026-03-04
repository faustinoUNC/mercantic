import Link from 'next/link'
import { Navbar } from '@/frontend/components/layout/Navbar'
import { Footer } from '@/frontend/components/layout/Footer'
import { ArrowRight, Tag } from 'lucide-react'
import { listProducts } from '@/backend/features/products/services/product.service'
import { formatPrice } from '@/lib/utils/formatting'

const ACCENTS = ['#e8783a', '#d4a55a', '#c4622d', '#7a5c44', '#b07a40']
const GLOWS  = [
  'rgba(232, 120, 58, 0.15)',
  'rgba(212, 165, 90, 0.15)',
  'rgba(196, 98, 45, 0.15)',
  'rgba(122, 92, 68, 0.15)',
  'rgba(176, 122, 64, 0.15)',
]

export const revalidate = 60

export default async function ProductosPage() {
  const products = await listProducts()

  return (
    <div style={{ background: '#0f0702', minHeight: '100vh' }}>
      <Navbar />

      {/* Page hero */}
      <div style={{
        paddingTop: '120px',
        paddingBottom: '4rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(196,98,45,0.08) 0%, transparent 60%)',
        borderBottom: '1px solid rgba(92, 53, 32, 0.2)',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
          <span style={{ color: '#c4622d', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
            Catálogo
          </span>
          <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 900,
          color: '#f5e6d3',
          marginBottom: '1rem',
        }}>
          Nuestros Modelos
        </h1>
        <p style={{ color: '#7a5c44', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
          Hechos a mano con chapa de 3,2mm. Dos tamaños, dos colores, distintos modelos.
        </p>
      </div>

      {/* Products grid */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '4rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '2rem',
      }}>
        {products.map((product, i) => {
          const accent = ACCENTS[i % ACCENTS.length]
          const bgGlow = GLOWS[i % GLOWS.length]
          const activeVariants = product.variants.filter(v => v.active)
          const prices = activeVariants.map(v => v.sale_price ?? v.price)
          const priceFrom = prices.length > 0 ? Math.min(...prices) : null
          const hasOffer = activeVariants.some(v => v.sale_price != null)

          return (
            <div key={product.slug} style={{
              background: 'linear-gradient(145deg, #2d1a0e, #1a0f07)',
              border: '1px solid rgba(92, 53, 32, 0.5)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {/* Visual / image */}
              <div style={{
                aspectRatio: '16/9',
                background: product.image_urls?.length
                  ? undefined
                  : `radial-gradient(ellipse at 50% 80%, ${bgGlow}, rgba(15, 7, 2, 0.9))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                borderBottom: '1px solid rgba(92, 53, 32, 0.3)',
                overflow: 'hidden',
              }}>
                {product.image_urls?.length ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={product.image_urls[0]}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '160px', height: '120px',
                    borderRadius: '10px',
                    background: 'linear-gradient(145deg, #3d2415, #1a0f07)',
                    border: `2px solid ${accent}50`,
                    boxShadow: `0 0 40px ${accent}30, inset 0 0 30px rgba(196,98,45,0.08)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '50%', height: '50%',
                      borderRadius: '4px',
                      background: `radial-gradient(circle, ${accent}40, transparent 70%)`,
                    }} />
                  </div>
                )}
                {/* Offer badge */}
                {hasOffer && (
                  <div style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: '#ef4444', color: 'white',
                    fontSize: '0.7rem', fontWeight: 700,
                    padding: '0.3rem 0.75rem', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}>
                    <Tag size={10} /> OFERTA
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '2rem' }}>
                <h2 style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: '#f5e6d3',
                  marginBottom: '0.75rem',
                }}>
                  {product.name}
                </h2>
                {product.description && (
                  <p style={{ color: '#7a5c44', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {product.description}
                  </p>
                )}

                {/* Info chips */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {['1,25m', '1,50m', 'Negro', 'Óxido'].map(tag => (
                    <span key={tag} style={{
                      background: 'rgba(92, 53, 32, 0.2)',
                      border: '1px solid rgba(92, 53, 32, 0.4)',
                      color: '#7a5c44',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '100px',
                      fontSize: '0.72rem',
                      letterSpacing: '0.05em',
                    }}>
                      {tag}
                    </span>
                  ))}
                  {product.includes?.slice(0, 3).map(inc => (
                    <span key={inc} style={{
                      background: 'rgba(92, 53, 32, 0.2)',
                      border: '1px solid rgba(92, 53, 32, 0.4)',
                      color: '#7a5c44',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '100px',
                      fontSize: '0.72rem',
                      letterSpacing: '0.05em',
                    }}>
                      {inc}
                    </span>
                  ))}
                </div>

                {/* Price + CTA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    {priceFrom !== null && (
                      <>
                        <div style={{ color: '#5c3520', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Desde</div>
                        <div style={{
                          fontFamily: 'var(--font-playfair), Georgia, serif',
                          fontSize: '1.5rem', fontWeight: 800,
                          background: `linear-gradient(135deg, ${accent}, #d4a55a)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>
                          {formatPrice(priceFrom)}
                        </div>
                      </>
                    )}
                  </div>
                  <Link href={`/productos/${product.slug}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: `linear-gradient(135deg, ${accent}30, ${accent}15)`,
                    border: `1px solid ${accent}50`,
                    color: '#f5e6d3',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    Ver detalle <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}

        {products.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 0', color: '#5c3520' }}>
            No hay productos disponibles por el momento.
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
