'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Circle, Square, Tag } from 'lucide-react'
import { useProducts } from '@/frontend/hooks/useProducts'
import type { ProductWithVariants } from '@/backend/features/products/models/product.model'

const SHAPE_CONFIG = {
  round: { accent: '#e8783a', glow: 'rgba(232,120,58,0.25)', label: 'Redondo' },
  square: { accent: '#d4a55a', glow: 'rgba(212,165,90,0.25)', label: 'Cuadrado' },
}

function getLowestPrice(product: ProductWithVariants) {
  const active = product.variants.filter(v => v.active)
  if (active.length === 0) return { from: null, original: null, hasSale: false }
  const salePrices = active.filter(v => v.sale_price != null).map(v => v.sale_price!)
  const regularPrices = active.map(v => v.price)
  const hasSale = salePrices.length > 0
  const from = hasSale ? Math.min(...salePrices) : Math.min(...regularPrices)
  const original = hasSale ? Math.min(...regularPrices) : null
  return { from, original, hasSale }
}

function FogoneroShape({ shape, glow }: { shape: 'round' | 'square'; glow: string }) {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 70%, ${glow} 0%, transparent 60%)` }} />
      <div style={{
        position: 'relative',
        width: shape === 'round' ? '160px' : '180px',
        height: shape === 'round' ? '160px' : '140px',
        borderRadius: shape === 'round' ? '50%' : '12px',
        background: 'radial-gradient(ellipse at 50% 40%, #5c3520 0%, #2d1a0e 40%, #1a0f07 100%)',
        border: '2px solid rgba(196, 98, 45, 0.4)',
        boxShadow: `inset 0 0 40px rgba(196, 98, 45, 0.15), 0 0 40px ${glow}, 0 0 80px rgba(196, 98, 45, 0.1)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: shape === 'round' ? '100px' : '120px', height: shape === 'round' ? '100px' : '90px',
          borderRadius: shape === 'round' ? '50%' : '6px',
          background: 'radial-gradient(ellipse at 50% 60%, rgba(245,158,11,0.3) 0%, rgba(196,98,45,0.15) 50%, transparent 70%)',
          border: '1px solid rgba(196, 98, 45, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: shape === 'round' ? '50%' : '4px', background: 'radial-gradient(circle, rgba(245,158,11,0.6), rgba(232,120,58,0.3), transparent)', boxShadow: '0 0 20px rgba(245,158,11,0.4)' }} />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={`h${i}`} style={{ position: 'absolute', left: '15%', right: '15%', top: `${25 + i * 17}%`, height: '1px', background: 'rgba(196, 98, 45, 0.2)' }} />
        ))}
        {[...Array(4)].map((_, i) => (
          <div key={`v${i}`} style={{ position: 'absolute', top: '15%', bottom: '15%', left: `${25 + i * 17}%`, width: '1px', background: 'rgba(196, 98, 45, 0.2)' }} />
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '40px', background: 'linear-gradient(to bottom, #5c3520, #2d1a0e)', borderRadius: '3px' }} />
    </div>
  )
}

function ProductCard({ product, index }: { product: ProductWithVariants; index: number }) {
  const [hovered, setHovered] = useState(false)
  const cfg = SHAPE_CONFIG[product.shape]
  const { from, original, hasSale } = getLowestPrice(product)
  const sizes = [...new Set(product.variants.filter(v => v.active).map(v => v.size))]
  const colors = [...new Set(product.variants.filter(v => v.active).map(v => v.color))]
    .map(c => c === 'negro' ? 'Negro' : 'Óxido')

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(145deg, #2d1a0e 0%, #1a0f07 100%)',
        border: `1px solid ${hovered ? cfg.accent + '60' : 'rgba(92, 53, 32, 0.5)'}`,
        borderRadius: '12px', overflow: 'hidden', transition: 'all 0.4s ease',
        boxShadow: hovered ? `0 0 60px ${cfg.glow}, 0 20px 60px rgba(0,0,0,0.6)` : '0 8px 40px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      <FogoneroShape shape={product.shape} glow={cfg.glow} />
      <div style={{ padding: 'clamp(1.25rem, 4vw, 1.75rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', fontWeight: 900, color: '#f5e6d3', margin: 0 }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(196, 98, 45, 0.12)', border: '1px solid rgba(196, 98, 45, 0.25)', padding: '0.3rem 0.75rem', borderRadius: '100px', color: '#c4a882', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {product.shape === 'round' ? <><Circle size={10} style={{ color: '#e8783a' }} /> Redondo</> : <><Square size={10} style={{ color: '#d4a55a' }} /> Cuadrado</>}
          </div>
        </div>

        {product.description && (
          <p style={{ color: '#7a5c44', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {product.description.length > 120 ? product.description.slice(0, 120) + '…' : product.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Tamaños', value: sizes.join(' / ') },
            { label: 'Colores', value: colors.join(' · ') },
          ].filter(s => s.value).map(({ label, value }) => (
            <div key={label} style={{ flex: 1, minWidth: '100px', background: 'rgba(92,53,32,0.2)', border: '1px solid rgba(92,53,32,0.4)', borderRadius: '6px', padding: '0.6rem 0.85rem' }}>
              <div style={{ color: '#7a5c44', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
              <div style={{ color: '#c4a882', fontSize: '0.85rem', fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>

        {from != null && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Desde </span>
              <span style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800, background: `linear-gradient(135deg, ${cfg.accent}, #d4a55a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                ${from.toLocaleString('es-AR')}
              </span>
              {hasSale && original && (
                <>
                  <span style={{ color: '#5c3520', fontSize: '0.9rem', textDecoration: 'line-through' }}>${original.toLocaleString('es-AR')}</span>
                  <span style={{ background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Tag size={9} /> OFERTA
                  </span>
                </>
              )}
              <span style={{ color: '#7a5c44', fontSize: '0.8rem' }}>ARS</span>
            </div>
          </div>
        )}

        <Link href={`/productos/${product.slug}`} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: `linear-gradient(135deg, ${cfg.accent}33, ${cfg.accent}15)`,
          border: `1px solid ${cfg.accent}60`, color: '#f5e6d3',
          padding: '0.85rem', borderRadius: '6px', textDecoration: 'none',
          fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', transition: 'all 0.3s ease', width: '100%',
        }}>
          Ver Detalle <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  )
}

export function ProductShowcase() {
  const { products, isLoading } = useProducts()
  const featured = products.filter(p => p.featured)
  const displayed = featured.length > 0 ? featured : products

  return (
    <section id="modelos" style={{ padding: 'clamp(5rem, 10vw, 8rem) 1.5rem', background: 'linear-gradient(to bottom, #0f0702, #1a0f07)', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
            <span style={{ color: '#c4622d', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>Nuestros Modelos</span>
            <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#f5e6d3', lineHeight: 1.1 }}>
            Dos formas.<br />
            <span style={{ background: 'linear-gradient(135deg, #d4a55a, #e8783a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Un solo fuego.
            </span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px,100%), 1fr))', gap: '1.5rem' }}>
            {[0, 1].map(i => <div key={i} style={{ background: 'rgba(45,26,14,0.4)', borderRadius: '12px', height: '500px' }} />)}
          </div>
        ) : (
          <div className="showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '1.5rem' }}>
            {displayed.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}

        {!isLoading && displayed.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} style={{ marginTop: '3rem', background: 'linear-gradient(135deg, rgba(196,98,45,0.1), rgba(212,165,90,0.05))', border: '1px solid rgba(196,98,45,0.2)', borderRadius: '12px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(1rem,4vw,3rem)', flexWrap: 'wrap' }}>
            <span style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Todos incluyen:</span>
            {(displayed[0]?.includes ?? ['Parrilla', 'Estaca', 'Tapa']).map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c4622d' }} />
                <span style={{ color: '#c4a882', fontSize: '0.95rem', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
            <span style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>· Chapa 3,2mm</span>
          </motion.div>
        )}
      </div>
      <style>{`
        @media (max-width: 480px) { .showcase-grid { gap: 1rem !important; } }
      `}</style>
    </section>
  )
}
