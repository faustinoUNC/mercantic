import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/frontend/components/layout/Navbar'
import { Footer } from '@/frontend/components/layout/Footer'
import { AddToCartSection } from '@/frontend/components/features/products/AddToCartSection'
import { ProductImageGallery } from '@/frontend/components/features/products/ProductImageGallery'
import { ArrowLeft, Package, Shield, Ruler, Tag } from 'lucide-react'
import { getProduct } from '@/backend/features/products/services/product.service'

const accent = '#e8783a'
const glow = 'rgba(232, 120, 58, 0.2)'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const hasOffer = product.variants.some(v => v.active && v.sale_price != null)
  const imageUrls: string[] = product.image_urls?.length
    ? product.image_urls
    : product.image_url ? [product.image_url] : []

  return (
    <div style={{ background: '#0f0702', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 1.5rem 4rem' }}>
        {/* Breadcrumb */}
        <Link href="/productos" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#5c3520', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '3rem' }}>
          <ArrowLeft size={14} /> Volver a modelos
        </Link>

        <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '4rem', alignItems: 'start' }}>
          {/* Visual */}
          <div style={{
            height: 'clamp(320px, 52vh, 520px)',
            background: `radial-gradient(ellipse at 50% 70%, ${glow}, rgba(15, 7, 2, 0.95))`,
            border: '1px solid rgba(92, 53, 32, 0.4)', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <ProductImageGallery
              images={imageUrls}
              productName={product.name}
              accentColor={accent}
              glow={glow}
            />
            {hasOffer && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ef4444', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.4rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px', zIndex: 3 }}>
                <Tag size={12} /> OFERTA
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Name — compact */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#c4622d', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>
                El Mercantic Fogoneros
              </div>
              <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 900, color: '#f5e6d3', lineHeight: 1 }}>
                {product.name}
              </h1>
            </div>

            {/* ── Add to cart FIRST — always visible ── */}
            <div style={{ background: 'rgba(45,26,14,0.4)', border: '1px solid rgba(92,53,32,0.35)', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
              <AddToCartSection
                productInfo={{ id: product.id, name: product.name, slug: product.slug }}
                variants={product.variants}
                includes={product.includes ?? undefined}
              />
            </div>

            {/* Description below the CTA */}
            {product.description && (
              <p style={{
                color: '#7a5c44', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.88rem',
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
              }}>
                {product.description}
              </p>
            )}

            {/* Info chips — below */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {([
                product.material ? { icon: Shield, label: 'Material', value: product.material } : null,
                product.includes?.length ? { icon: Package, label: 'Incluye', value: product.includes.join(' · ') } : null,
                {
                  icon: Ruler, label: 'Colores',
                  value: [...new Set(product.variants.map(v => v.color))]
                    .map(c => c === 'oxido' ? 'Óxido' : c.charAt(0).toUpperCase() + c.slice(1))
                    .join(' · '),
                },
              ] as const).filter((x): x is NonNullable<typeof x> => x !== null).map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ background: 'rgba(45,26,14,0.6)', border: '1px solid rgba(92,53,32,0.35)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
                  <Icon size={16} style={{ color: '#c4622d', marginBottom: '0.4rem' }} />
                  <div style={{ color: '#5c3520', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ color: '#c4a882', fontSize: '0.8rem', fontWeight: 500, marginTop: '2px' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 640px) {
          .product-detail-grid { gap: 2rem !important; }
        }
        @media (max-width: 480px) {
          .product-detail-grid { gap: 1.5rem !important; }
        }
      `}</style>
    </div>
  )
}
