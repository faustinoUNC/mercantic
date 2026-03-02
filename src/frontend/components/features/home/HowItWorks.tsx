'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Selección del material',
    description: 'Elegimos chapa de 3,2mm de alta resistencia. Solo el acero más grueso aguanta décadas de fuego y calor extremo.',
    detail: 'Chapa gruesa · Alta temperatura',
  },
  {
    number: '02',
    title: 'Corte y moldeado',
    description: 'Cada pieza se corta y moldea a mano según las medidas exactas del modelo elegido: T-REX o RAPTOR.',
    detail: 'Corte artesanal · Precisión manual',
  },
  {
    number: '03',
    title: 'Soldadura artesanal',
    description: 'Las juntas se sueldan punto por punto. No hay máquinas CNC. Solo maestros que conocen el hierro.',
    detail: 'Soldadura manual · Sin CNC',
  },
  {
    number: '04',
    title: 'Acabado final',
    description: 'Negro mate o acabado óxido, según tu elección. El producto sale listo para su primer encendido.',
    detail: 'Negro o Óxido · Control de calidad',
  },
]

export function HowItWorks() {
  return (
    <section style={{
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
      background: '#0f0702',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Vertical ember line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '10%',
        bottom: '10%',
        width: '1px',
        background: 'linear-gradient(to bottom, transparent, rgba(196, 98, 45, 0.3) 20%, rgba(196, 98, 45, 0.3) 80%, transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
            <span style={{ color: '#c4622d', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
              Proceso Artesanal
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
            Del hierro al fuego.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #e8783a, #d4a55a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Paso a paso.
            </span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 1fr',
                alignItems: 'center',
                minHeight: '140px',
              }}
            >
              {/* Left content (even steps) */}
              <div style={{
                textAlign: 'right',
                padding: '2rem 2.5rem 2rem 1rem',
                ...(index % 2 !== 0 ? { opacity: 0, pointerEvents: 'none' } : {}),
              }}>
                {index % 2 === 0 && (
                  <>
                    <div style={{ color: '#7a5c44', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {step.detail}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#f5e6d3',
                      marginBottom: '0.5rem',
                    }}>
                      {step.title}
                    </h3>
                    <p style={{ color: '#7a5c44', fontSize: '0.875rem', lineHeight: 1.65 }}>
                      {step.description}
                    </p>
                  </>
                )}
              </div>

              {/* Center node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3d2415, #2d1a0e)',
                  border: '2px solid rgba(196, 98, 45, 0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(196, 98, 45, 0.25)',
                  position: 'relative', zIndex: 2,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #e8783a, #d4a55a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Right content (odd steps) */}
              <div style={{
                padding: '2rem 1rem 2rem 2.5rem',
                ...(index % 2 === 0 ? { opacity: 0, pointerEvents: 'none' } : {}),
              }}>
                {index % 2 !== 0 && (
                  <>
                    <div style={{ color: '#7a5c44', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {step.detail}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#f5e6d3',
                      marginBottom: '0.5rem',
                    }}>
                      {step.title}
                    </h3>
                    <p style={{ color: '#7a5c44', fontSize: '0.875rem', lineHeight: 1.65 }}>
                      {step.description}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          /* Stack steps vertically on mobile */
        }
      `}</style>
    </section>
  )
}
