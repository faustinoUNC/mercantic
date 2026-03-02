import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/frontend/components/layout/Navbar'
import { Footer } from '@/frontend/components/layout/Footer'
import { VariantSelector } from '@/frontend/components/features/products/VariantSelector'
import { MessageCircle, ArrowLeft, Package, Shield, Ruler } from 'lucide-react'

const PRODUCTS: Record<string, {
  slug: string; name: string; shape: 'round' | 'square'
  tagline: string; description: string; accent: string; glow: string
}> = {
  't-rex': {
    slug: 't-rex', name: 'T-REX', shape: 'round',
    tagline: 'El círculo del fuego perfecto',
    description: 'El T-REX es el fogonero redondo por excelencia. Su diseño circular crea el espacio perfecto para reunirse en rueda alrededor del fuego. Fabricado artesanalmente con chapa de 3,2mm de alta resistencia, está pensado para durar toda la vida. Incluye parrilla, estaca y tapa. Disponible en negro mate o acabado óxido.',
    accent: '#e8783a', glow: 'rgba(232, 120, 58, 0.2)',
  },
  'raptor': {
    slug: 'raptor', name: 'RAPTOR', shape: 'square',
    tagline: 'Máxima superficie de cocción',
    description: 'El RAPTOR es para quienes quieren más. Su diseño cuadrado ofrece la mayor superficie de cocción, ideal para asados grandes y grupos exigentes. La misma chapa de 3,2mm de alta resistencia, la misma fabricación artesanal, pero con una geometría que maximiza el espacio de la parrilla.',
    accent: '#d4a55a', glow: 'rgba(212, 165, 90, 0.2)',
  },
}

export async function generateStaticParams() {
  return Object.keys(PRODUCTS).map(slug => ({ slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = PRODUCTS[slug]
  if (!product) notFound()

  return (
    <div style={{ background: '#0f0702', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ paddingTop: '100px', maxWidth: '1200px', margin: '0 auto', padding: '100px 1.5rem 4rem' }}>
        {/* Breadcrumb */}
        <Link href="/productos" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#5c3520', textDecoration: 'none', fontSize: '0.85rem',
          marginBottom: '3rem',
        }}>
          <ArrowLeft size={14} /> Volver a modelos
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '4rem',
          alignItems: 'start',
        }}>
          {/* Visual */}
          <div style={{
            aspectRatio: '1',
            background: `radial-gradient(ellipse at 50% 70%, ${product.glow}, rgba(15, 7, 2, 0.95))`,
            border: '1px solid rgba(92, 53, 32, 0.4)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Rings */}
            {[300, 220, 140, 70].map((size, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: `${size}px`, height: `${size}px`,
                borderRadius: product.shape === 'round' ? '50%' : `${16 - i * 3}px`,
                border: `1px solid rgba(196, 98, 45, ${0.04 + i * 0.04})`,
              }} />
            ))}
            {/* Main shape */}
            <div style={{
              width: product.shape === 'round' ? '200px' : '230px',
              height: product.shape === 'round' ? '200px' : '190px',
              borderRadius: product.shape === 'round' ? '50%' : '16px',
              background: 'linear-gradient(145deg, #3d2415, #1a0f07)',
              border: `2px solid ${product.accent}50`,
              boxShadow: `0 0 60px ${product.accent}25, inset 0 0 40px rgba(196,98,45,0.08)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2,
            }}>
              <div style={{
                width: '55%', height: '55%',
                borderRadius: product.shape === 'round' ? '50%' : '8px',
                background: `radial-gradient(circle, ${product.accent}35, transparent 70%)`,
                boxShadow: `0 0 30px ${product.accent}20`,
              }} />
            </div>

            {/* Name overlay */}
            <div style={{
              position: 'absolute', bottom: '1.5rem', left: '1.5rem',
            }}>
              <span style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: '3rem', fontWeight: 900,
                background: `linear-gradient(135deg, ${product.accent}, #d4a55a)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                opacity: 0.3,
              }}>
                {product.name}
              </span>
            </div>
          </div>

          {/* Details */}
          <div>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#c4622d', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                El Mercantic Fogoneros
              </div>
              <h1 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: '3.5rem', fontWeight: 900, color: '#f5e6d3',
                letterSpacing: '-0.01em', lineHeight: 1, marginBottom: '0.5rem',
              }}>
                {product.name}
              </h1>
              <p style={{
                color: '#c4622d', fontSize: '1rem', fontStyle: 'italic',
                fontFamily: 'var(--font-playfair), Georgia, serif',
              }}>
                "{product.tagline}"
              </p>
            </div>

            {/* Description */}
            <p style={{ color: '#7a5c44', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.95rem' }}>
              {product.description}
            </p>

            {/* Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { icon: Shield, label: 'Material', value: 'Chapa 3,2mm' },
                { icon: Package, label: 'Incluye', value: 'Parrilla · Estaca · Tapa' },
                { icon: Ruler, label: 'Colores', value: 'Negro · Óxido' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{
                  background: 'rgba(45, 26, 14, 0.6)',
                  border: '1px solid rgba(92, 53, 32, 0.35)',
                  borderRadius: '8px',
                  padding: '0.85rem',
                }}>
                  <Icon size={16} style={{ color: '#c4622d', marginBottom: '0.4rem' }} />
                  <div style={{ color: '#5c3520', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ color: '#c4a882', fontSize: '0.8rem', fontWeight: 500, marginTop: '2px' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Variant selector */}
            <div style={{
              background: 'rgba(45, 26, 14, 0.4)',
              border: '1px solid rgba(92, 53, 32, 0.35)',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              <VariantSelector />
            </div>

            {/* Purchase CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href={`https://wa.me/5493513000000?text=Hola!%20Me%20interesa%20el%20fogonero%20${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  background: 'linear-gradient(135deg, #c4622d, #e8783a)',
                  color: '#f5e6d3',
                  padding: '1rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 30px rgba(196, 98, 45, 0.3)',
                }}
              >
                <MessageCircle size={18} />
                Consultar por WhatsApp
              </a>
              <p style={{ color: '#3d2415', fontSize: '0.75rem', textAlign: 'center' }}>
                Envíos a todo el país · Pago en cuotas disponible
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
