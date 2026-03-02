import Link from 'next/link'
import { Navbar } from '@/frontend/components/layout/Navbar'
import { Footer } from '@/frontend/components/layout/Footer'
import { ArrowRight, Circle, Square } from 'lucide-react'

const PRODUCTS = [
  {
    slug: 't-rex',
    name: 'T-REX',
    shape: 'round' as const,
    tagline: 'El círculo del fuego perfecto',
    description: 'Diseño redondo clásico. Ideal para reuniones en rueda alrededor del fuego central.',
    priceFrom: 1287000,
    priceTo: 1405000,
    bgGlow: 'rgba(232, 120, 58, 0.15)',
    accent: '#e8783a',
  },
  {
    slug: 'raptor',
    name: 'RAPTOR',
    shape: 'square' as const,
    tagline: 'Máxima superficie de cocción',
    description: 'Diseño cuadrado para grandes asados. Más espacio, más control, más sabor.',
    priceFrom: 1287000,
    priceTo: 1405000,
    bgGlow: 'rgba(212, 165, 90, 0.15)',
    accent: '#d4a55a',
  },
]

export default function ProductosPage() {
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
          Dos modelos, cuatro variantes de color, dos tamaños. Todos hechos a mano con chapa de 3,2mm.
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
        {PRODUCTS.map((product) => (
          <div key={product.slug} style={{
            background: 'linear-gradient(145deg, #2d1a0e, #1a0f07)',
            border: '1px solid rgba(92, 53, 32, 0.5)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {/* Visual placeholder */}
            <div style={{
              aspectRatio: '16/9',
              background: `radial-gradient(ellipse at 50% 80%, ${product.bgGlow}, rgba(15, 7, 2, 0.9))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              borderBottom: '1px solid rgba(92, 53, 32, 0.3)',
            }}>
              {/* Shape representation */}
              <div style={{
                width: product.shape === 'round' ? '140px' : '160px',
                height: product.shape === 'round' ? '140px' : '120px',
                borderRadius: product.shape === 'round' ? '50%' : '10px',
                background: 'linear-gradient(145deg, #3d2415, #1a0f07)',
                border: `2px solid ${product.accent}50`,
                boxShadow: `0 0 40px ${product.accent}30, inset 0 0 30px rgba(196,98,45,0.08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '50%', height: '50%',
                  borderRadius: product.shape === 'round' ? '50%' : '4px',
                  background: `radial-gradient(circle, ${product.accent}40, transparent 70%)`,
                }} />
              </div>
              {/* Model badge */}
              <div style={{
                position: 'absolute', top: '1rem', left: '1rem',
                background: 'rgba(15, 7, 2, 0.8)',
                border: `1px solid ${product.accent}40`,
                borderRadius: '100px',
                padding: '0.3rem 0.75rem',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                {product.shape === 'round'
                  ? <Circle size={10} style={{ color: product.accent }} />
                  : <Square size={10} style={{ color: product.accent }} />}
                <span style={{ color: '#c4a882', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {product.shape === 'round' ? 'Redondo' : 'Cuadrado'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#f5e6d3',
                marginBottom: '0.25rem',
              }}>
                {product.name}
              </h2>
              <p style={{ color: '#c4622d', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '0.75rem', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                "{product.tagline}"
              </p>
              <p style={{ color: '#7a5c44', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {product.description}
              </p>

              {/* Info chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {['1,25m', '1,50m', 'Negro', 'Óxido', 'Parrilla + Estaca + Tapa'].map(tag => (
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
              </div>

              {/* Price + CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#5c3520', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Desde</div>
                  <div style={{
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontSize: '1.5rem', fontWeight: 800,
                    background: `linear-gradient(135deg, ${product.accent}, #d4a55a)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    ${product.priceFrom.toLocaleString('es-AR')}
                  </div>
                </div>
                <Link href={`/productos/${product.slug}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: `linear-gradient(135deg, ${product.accent}30, ${product.accent}15)`,
                  border: `1px solid ${product.accent}50`,
                  color: '#f5e6d3',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                }}>
                  Ver detalle <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
