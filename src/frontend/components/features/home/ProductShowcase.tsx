'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Circle, Square } from 'lucide-react'

const PRODUCTS = [
  {
    slug: 't-rex',
    name: 'T-REX',
    shape: 'round' as const,
    tagline: 'El círculo del fuego perfecto',
    description: 'Diseño redondo clásico para el fogonero central. La forma que invita a reunirse en rueda alrededor del fuego.',
    priceFrom: 1287000,
    priceTo: 1405000,
    sizes: ['1,25m', '1,50m'],
    colors: ['Negro', 'Óxido'],
    accentColor: '#e8783a',
    glowColor: 'rgba(232, 120, 58, 0.25)',
  },
  {
    slug: 'raptor',
    name: 'RAPTOR',
    shape: 'square' as const,
    tagline: 'Máxima superficie de cocción',
    description: 'Diseño cuadrado para asados grandes. Más superficie, más control. El fogonero del que habla la gente.',
    priceFrom: 1287000,
    priceTo: 1405000,
    sizes: ['1,25m', '1,50m'],
    colors: ['Negro', 'Óxido'],
    accentColor: '#d4a55a',
    glowColor: 'rgba(212, 165, 90, 0.25)',
  },
]

function FogoneroShape({ shape, color }: { shape: 'round' | 'square'; color: string }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '4/3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 70%, ${color} 0%, transparent 60%)`,
      }} />

      {/* The fogonero shape */}
      <div style={{
        position: 'relative',
        width: shape === 'round' ? '160px' : '180px',
        height: shape === 'round' ? '160px' : '140px',
        borderRadius: shape === 'round' ? '50%' : '12px',
        background: `
          radial-gradient(ellipse at 50% 40%, #5c3520 0%, #2d1a0e 40%, #1a0f07 100%)
        `,
        border: `2px solid rgba(196, 98, 45, 0.4)`,
        boxShadow: `
          inset 0 0 40px rgba(196, 98, 45, 0.15),
          0 0 40px ${color},
          0 0 80px rgba(196, 98, 45, 0.1)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Inner fire glow */}
        <div style={{
          width: shape === 'round' ? '100px' : '120px',
          height: shape === 'round' ? '100px' : '90px',
          borderRadius: shape === 'round' ? '50%' : '6px',
          background: 'radial-gradient(ellipse at 50% 60%, rgba(245,158,11,0.3) 0%, rgba(196,98,45,0.15) 50%, transparent 70%)',
          border: '1px solid rgba(196, 98, 45, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: shape === 'round' ? '50%' : '4px',
            background: 'radial-gradient(circle, rgba(245,158,11,0.6), rgba(232,120,58,0.3), transparent)',
            boxShadow: '0 0 20px rgba(245,158,11,0.4)',
          }} />
        </div>

        {/* Grid lines (parrilla) */}
        {[...Array(4)].map((_, i) => (
          <div key={`h${i}`} style={{
            position: 'absolute',
            left: '15%', right: '15%',
            top: `${25 + i * 17}%`,
            height: '1px',
            background: 'rgba(196, 98, 45, 0.2)',
          }} />
        ))}
        {[...Array(4)].map((_, i) => (
          <div key={`v${i}`} style={{
            position: 'absolute',
            top: '15%', bottom: '15%',
            left: `${25 + i * 17}%`,
            width: '1px',
            background: 'rgba(196, 98, 45, 0.2)',
          }} />
        ))}
      </div>

      {/* Estaca / leg */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '6px',
        height: '40px',
        background: 'linear-gradient(to bottom, #5c3520, #2d1a0e)',
        borderRadius: '3px',
        boxShadow: '0 0 8px rgba(196, 98, 45, 0.2)',
      }} />
    </div>
  )
}

export function ProductShowcase() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  return (
    <section id="modelos" style={{
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
      background: 'linear-gradient(to bottom, #0f0702, #1a0f07)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem',
          }}>
            <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
            <span style={{ color: '#c4622d', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
              Nuestros Modelos
            </span>
            <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            color: '#f5e6d3',
            lineHeight: 1.1,
          }}>
            Dos formas.<br />
            <span style={{
              background: 'linear-gradient(135deg, #d4a55a, #e8783a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Un solo fuego.
            </span>
          </h2>
        </motion.div>

        {/* Product cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
        }}>
          {PRODUCTS.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredProduct(product.slug)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{
                background: 'linear-gradient(145deg, #2d1a0e 0%, #1a0f07 100%)',
                border: `1px solid ${hoveredProduct === product.slug ? product.accentColor + '60' : 'rgba(92, 53, 32, 0.5)'}`,
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                boxShadow: hoveredProduct === product.slug
                  ? `0 0 60px ${product.glowColor}, 0 20px 60px rgba(0,0,0,0.6)`
                  : '0 8px 40px rgba(0,0,0,0.4)',
                transform: hoveredProduct === product.slug ? 'translateY(-6px)' : 'translateY(0)',
                cursor: 'default',
              }}
            >
              {/* Product visual */}
              <FogoneroShape shape={product.shape} color={product.glowColor} />

              {/* Content */}
              <div style={{ padding: '1.75rem' }}>
                {/* Model name + shape badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontSize: '2.25rem',
                    fontWeight: 900,
                    color: '#f5e6d3',
                    letterSpacing: '-0.01em',
                    margin: 0,
                  }}>
                    {product.name}
                  </h3>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(196, 98, 45, 0.12)',
                    border: '1px solid rgba(196, 98, 45, 0.25)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '100px',
                    color: '#c4a882',
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    {product.shape === 'round'
                      ? <><Circle size={10} style={{ color: '#e8783a' }} /> Redondo</>
                      : <><Square size={10} style={{ color: '#d4a55a' }} /> Cuadrado</>
                    }
                  </div>
                </div>

                <p style={{
                  color: '#c4622d',
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                }}>
                  "{product.tagline}"
                </p>

                <p style={{
                  color: '#7a5c44',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                }}>
                  {product.description}
                </p>

                {/* Specs row */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Tamaños', value: product.sizes.join(' / ') },
                    { label: 'Colores', value: product.colors.join(' · ') },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      flex: 1, minWidth: '120px',
                      background: 'rgba(92, 53, 32, 0.2)',
                      border: '1px solid rgba(92, 53, 32, 0.4)',
                      borderRadius: '6px',
                      padding: '0.6rem 0.85rem',
                    }}>
                      <div style={{ color: '#7a5c44', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
                      <div style={{ color: '#c4a882', fontSize: '0.85rem', fontWeight: 600 }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Desde </span>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${product.accentColor}, #d4a55a)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    ${product.priceFrom.toLocaleString('es-AR')}
                  </span>
                  <span style={{ color: '#7a5c44', fontSize: '0.8rem', marginLeft: '4px' }}>ARS</span>
                </div>

                {/* CTA */}
                <Link href={`/productos/${product.slug}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: `linear-gradient(135deg, ${product.accentColor}33, ${product.accentColor}15)`,
                  border: `1px solid ${product.accentColor}60`,
                  color: '#f5e6d3',
                  padding: '0.85rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  width: '100%',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${product.accentColor}55, ${product.accentColor}30)`
                    e.currentTarget.style.borderColor = product.accentColor
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${product.accentColor}33, ${product.accentColor}15)`
                    e.currentTarget.style.borderColor = `${product.accentColor}60`
                  }}
                >
                  Ver Detalle <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Includes banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginTop: '3rem',
            background: 'linear-gradient(135deg, rgba(196, 98, 45, 0.1), rgba(212, 165, 90, 0.05))',
            border: '1px solid rgba(196, 98, 45, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Todos incluyen:</span>
          {['Parrilla', 'Estaca', 'Tapa'].map((item, i) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c4622d' }} />
              <span style={{ color: '#c4a882', fontSize: '0.95rem', fontWeight: 500 }}>{item}</span>
            </div>
          ))}
          <span style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>· Chapa 3,2mm</span>
        </motion.div>
      </div>
    </section>
  )
}
