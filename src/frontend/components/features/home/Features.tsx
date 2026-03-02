'use client'

import { motion } from 'framer-motion'
import { Hammer, Shield, Package, Palette, Ruler, Star } from 'lucide-react'

const FEATURES = [
  {
    icon: Hammer,
    title: 'Hecho a Mano',
    description: 'Cada fogonero es forjado artesanalmente por maestros del hierro. No hay dos iguales.',
    accent: '#e8783a',
  },
  {
    icon: Shield,
    title: 'Chapa 3,2mm',
    description: 'Material de alta resistencia al calor y a los golpes. Construido para durar décadas.',
    accent: '#c4622d',
  },
  {
    icon: Package,
    title: 'Todo Incluido',
    description: 'Viene con parrilla, estaca y tapa. Listo para usar desde el primer encendido.',
    accent: '#d4a55a',
  },
  {
    icon: Palette,
    title: '2 Acabados',
    description: 'Negro mate para un look industrial. Óxido para ese estilo rústico que no pasa de moda.',
    accent: '#e8783a',
  },
  {
    icon: Ruler,
    title: '2 Tamaños',
    description: 'Disponibles en 1,25m y 1,50m. El tamaño ideal para tu espacio y tu grupo.',
    accent: '#c4622d',
  },
  {
    icon: Star,
    title: 'Calidad Garantizada',
    description: 'Respaldado por años de experiencia. Cada pieza pasa por control de calidad antes de salir.',
    accent: '#d4a55a',
  },
]

export function Features() {
  return (
    <section style={{
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
      background: 'linear-gradient(to bottom, #1a0f07, #0f0702)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background texture lines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${15 + i * 15}%`,
            left: 0, right: 0,
            height: '1px',
            background: `linear-gradient(to right, transparent 0%, rgba(92, 53, 32, ${0.08 + i * 0.01}) 20%, rgba(92, 53, 32, ${0.08 + i * 0.01}) 80%, transparent 100%)`,
          }} />
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
            <span style={{ color: '#c4622d', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
              Por qué elegirnos
            </span>
            <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
            fontWeight: 800,
            color: '#f5e6d3',
            lineHeight: 1.15,
          }}>
            Más que un asador.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #e8783a, #d4a55a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Una obra de hierro.
            </span>
          </h2>
        </motion.div>

        {/* Features grid */}
        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '1rem',
        }}>
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="feature-card"
                style={{
                  background: 'linear-gradient(145deg, rgba(45, 26, 14, 0.8), rgba(26, 15, 7, 0.9))',
                  border: '1px solid rgba(92, 53, 32, 0.4)',
                  borderRadius: '10px',
                  padding: 'clamp(1rem, 4vw, 2rem)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.35s ease',
                  cursor: 'default',
                }}
                whileHover={{
                  y: -4,
                  borderColor: `${feature.accent}50`,
                  boxShadow: `0 0 30px ${feature.accent}15, 0 12px 40px rgba(0,0,0,0.4)`,
                }}
              >
                {/* Corner accent */}
                <div style={{
                  position: 'absolute',
                  top: 0, right: 0,
                  width: '60px', height: '60px',
                  background: `linear-gradient(225deg, ${feature.accent}15, transparent)`,
                  borderRadius: '0 10px 0 0',
                }} />

                {/* Icon */}
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${feature.accent}20, ${feature.accent}08)`,
                  border: `1px solid ${feature.accent}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: `0 0 16px ${feature.accent}15`,
                }}>
                  <Icon size={22} style={{ color: feature.accent }} />
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#f5e6d3',
                  marginBottom: '0.6rem',
                }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#7a5c44', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        /* 2 columns on small mobile */
        @media (max-width: 540px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .feature-card h3 { font-size: 1rem !important; }
          .feature-card p  { font-size: 0.8rem !important; }
        }
      `}</style>
    </section>
  )
}
