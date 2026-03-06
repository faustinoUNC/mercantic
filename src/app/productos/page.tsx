import { Navbar } from '@/frontend/components/layout/Navbar'
import { Footer } from '@/frontend/components/layout/Footer'
import { listProducts } from '@/backend/features/products/services/product.service'
import { ProductGrid } from '@/frontend/components/features/products/ProductGrid'

export const revalidate = 60

export default async function ProductosPage() {
  const products = await listProducts()

  return (
    <div style={{ background: '#0f0702', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Page hero ─────────────────────────────────────────────────────── */}
      <div style={{
        paddingTop:    'clamp(100px, 14vw, 140px)',
        paddingBottom: 'clamp(3rem, 5vw, 4.5rem)',
        paddingLeft:   '1.5rem',
        paddingRight:  '1.5rem',
        textAlign:     'center',
        position:      'relative',
        overflow:      'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position:   'absolute', top: 0, left: '50%',
          transform:  'translateX(-50%)',
          width:      '700px', height: '400px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(196,98,45,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Overline */}
        <div style={{
          display:       'inline-flex', alignItems: 'center', gap: '12px',
          marginBottom:  '1.5rem',
          position:      'relative',
        }}>
          <div style={{ width: '36px', height: '1px', background: 'rgba(196,98,45,0.5)' }} />
          <span style={{
            color:          '#c4622d',
            fontSize:       '0.68rem',
            letterSpacing:  '0.3em',
            textTransform:  'uppercase',
            fontWeight:     600,
          }}>
            Catálogo
          </span>
          <div style={{ width: '36px', height: '1px', background: 'rgba(196,98,45,0.5)' }} />
        </div>

        <h1 style={{
          fontFamily:    'var(--font-playfair), Georgia, serif',
          fontSize:      'clamp(2.8rem, 6vw, 4.5rem)',
          fontWeight:    900,
          color:         '#f5e6d3',
          marginBottom:  '1rem',
          lineHeight:    1.0,
          letterSpacing: '-0.02em',
          position:      'relative',
        }}>
          Nuestros Modelos
        </h1>

        <p style={{
          color:     '#6b4e38',
          fontSize:  'clamp(0.88rem, 1.5vw, 1rem)',
          maxWidth:  '480px',
          margin:    '0 auto',
          lineHeight: 1.65,
          position:  'relative',
        }}>
          Hechos a mano con chapa de 3,2&nbsp;mm.<br />
          Dos tamaños, dos colores, distintos modelos.
        </p>

        {/* Bottom separator */}
        <div style={{
          position:   'absolute', bottom: 0, left: 'clamp(2rem, 8vw, 6rem)', right: 'clamp(2rem, 8vw, 6rem)',
          height:     '1px',
          background: 'linear-gradient(to right, transparent, rgba(92,53,32,0.3), transparent)',
        }} />
      </div>

      {/* ── Grid (client component handles animations + sort) ──────────────── */}
      <ProductGrid products={products} />

      <Footer />
    </div>
  )
}
