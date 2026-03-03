import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/frontend/components/layout/Navbar'
import { Footer } from '@/frontend/components/layout/Footer'
import { AddToCartSection } from '@/frontend/components/features/products/AddToCartSection'
import { ArrowLeft, Package, Shield, Ruler, Tag } from 'lucide-react'
import { getProduct } from '@/backend/features/products/services/product.service'

const SHAPE_CONFIG = {
  round: { accent: '#e8783a', glow: 'rgba(232, 120, 58, 0.2)' },
  square: { accent: '#d4a55a', glow: 'rgba(212, 165, 90, 0.2)' },
}

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const cfg = SHAPE_CONFIG[product.shape]
  const hasOffer = product.variants.some(v => v.active && v.sale_price != null)

  return (
    <div style={{ background: '#0f0702', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 1.5rem 4rem' }}>
        {/* Breadcrumb */}
        <Link href="/productos" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#5c3520', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '3rem' }}>
          <ArrowLeft size={14} /> Volver a modelos
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '4rem', alignItems: 'start' }}>
          {/* Visual */}
          <div style={{
            aspectRatio: '1',
            background: `radial-gradient(ellipse at 50% 70%, ${cfg.glow}, rgba(15, 7, 2, 0.95))`,
            border: '1px solid rgba(92, 53, 32, 0.4)', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {[300, 220, 140, 70].map((size, i) => (
              <div key={i} style={{ position: 'absolute', width: `${size}px`, height: `${size}px`, borderRadius: product.shape === 'round' ? '50%' : `${16 - i * 3}px`, border: `1px solid rgba(196, 98, 45, ${0.04 + i * 0.04})` }} />
            ))}
            <div style={{
              width: product.shape === 'round' ? '200px' : '230px',
              height: product.shape === 'round' ? '200px' : '190px',
              borderRadius: product.shape === 'round' ? '50%' : '16px',
              background: 'linear-gradient(145deg, #3d2415, #1a0f07)',
              border: `2px solid ${cfg.accent}50`,
              boxShadow: `0 0 60px ${cfg.accent}25, inset 0 0 40px rgba(196,98,45,0.08)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
            }}>
              <div style={{ width: '55%', height: '55%', borderRadius: product.shape === 'round' ? '50%' : '8px', background: `radial-gradient(circle, ${cfg.accent}35, transparent 70%)` }} />
            </div>
            {hasOffer && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ef4444', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.4rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Tag size={12} /> OFERTA
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '3rem', fontWeight: 900, background: `linear-gradient(135deg, ${cfg.accent}, #d4a55a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', opacity: 0.3 }}>
                {product.name}
              </span>
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#c4622d', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                El Mercantic Fogoneros
              </div>
              <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: 900, color: '#f5e6d3', lineHeight: 1, marginBottom: '0.5rem' }}>
                {product.name}
              </h1>
            </div>

            {product.description && (
              <p style={{ color: '#7a5c44', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.95rem' }}>
                {product.description}
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { icon: Shield, label: 'Material', value: product.material ?? 'Chapa 3,2mm' },
                { icon: Package, label: 'Incluye', value: (product.includes ?? ['Parrilla', 'Estaca', 'Tapa']).join(' · ') },
                { icon: Ruler, label: 'Colores', value: 'Negro · Óxido' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ background: 'rgba(45,26,14,0.6)', border: '1px solid rgba(92,53,32,0.35)', borderRadius: '8px', padding: '0.85rem' }}>
                  <Icon size={16} style={{ color: '#c4622d', marginBottom: '0.4rem' }} />
                  <div style={{ color: '#5c3520', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ color: '#c4a882', fontSize: '0.8rem', fontWeight: 500, marginTop: '2px' }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(45,26,14,0.4)', border: '1px solid rgba(92,53,32,0.35)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <AddToCartSection
                productInfo={{ id: product.id, name: product.name, slug: product.slug, shape: product.shape }}
                variants={product.variants}
                includes={product.includes ?? undefined}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
