'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const EMBER_COUNT = 28

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function Hero() {
  const embersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!embersRef.current) return
    const container = embersRef.current

    const embers = Array.from({ length: EMBER_COUNT }, (_, i) => {
      const el = document.createElement('div')
      const size = randomBetween(2, 6)
      const left = randomBetween(10, 90)
      const duration = randomBetween(4, 10)
      const delay = randomBetween(0, 8)
      const drift = randomBetween(-40, 40)

      el.style.cssText = `
        position: absolute;
        bottom: 0;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, #f59e0b, #e8783a, transparent);
        opacity: 0;
        pointer-events: none;
        animation: emberRise ${duration}s ${delay}s infinite ease-out;
        --drift: ${drift}px;
        box-shadow: 0 0 ${size * 2}px ${size}px rgba(232, 120, 58, 0.4);
      `
      return el
    })

    embers.forEach(el => container.appendChild(el))
    return () => embers.forEach(el => el.remove())
  }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 100%, #3d1a08 0%, #1a0f07 45%, #0f0702 100%)',
    }}>
      {/* Deep background glow — the forge */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120vw',
        height: '60vh',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(196,98,45,0.18) 0%, rgba(232,120,58,0.06) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Horizontal forge lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {[0.15, 0.35, 0.55, 0.75, 0.88].map((opacity, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: 0, right: 0,
            bottom: `${10 + i * 14}%`,
            height: '1px',
            background: `linear-gradient(to right, transparent, rgba(196, 98, 45, ${opacity * 0.25}), transparent)`,
          }} />
        ))}
      </div>

      {/* Concentric fire rings */}
      <div style={{
        position: 'absolute',
        bottom: '-5%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }}>
        {[500, 380, 260, 160, 80].map((size, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${size}px`,
            height: `${size * 0.5}px`,
            borderRadius: '50% 50% 0 0',
            border: `1px solid rgba(196, 98, 45, ${0.04 + i * 0.03})`,
            boxShadow: `inset 0 0 ${30 + i * 20}px rgba(196, 98, 45, ${0.02 + i * 0.015})`,
          }} />
        ))}
      </div>

      {/* Ember particles container */}
      <div ref={embersRef} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center',
        padding: '0 1.5rem',
        maxWidth: '900px',
      }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '2rem',
          }}
        >
          <div style={{ width: '40px', height: '1px', background: 'rgba(196, 98, 45, 0.6)' }} />
          <span style={{
            color: '#c4622d',
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Artesanal · Chapa 3,2mm · Hecho a mano
          </span>
          <div style={{ width: '40px', height: '1px', background: 'rgba(196, 98, 45, 0.6)' }} />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, #f5e6d3 0%, #d4a55a 40%, #e8783a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Forjados
          </span>
          <span style={{
            display: 'block',
            color: '#f5e6d3',
            fontSize: '0.85em',
          }}>
            para el
          </span>
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, #f59e0b 0%, #e8783a 50%, #c4622d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 30px rgba(232, 120, 58, 0.4))',
          }}>
            Fuego
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{
            color: '#c4a882',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: 1.7,
            maxWidth: '560px',
            margin: '0 auto 3rem',
            fontWeight: 400,
          }}
        >
          Fogoneros artesanales hechos a mano. Chapa de 3,2 mm de alta resistencia.
          Modelos T-REX y RAPTOR, para el asado que merece ser recordado.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/productos" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #c4622d 0%, #e8783a 100%)',
            color: '#f5e6d3',
            padding: '0.9rem 2.25rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            boxShadow: '0 0 24px rgba(196, 98, 45, 0.4), 0 4px 20px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(196, 98, 45, 0.6), 0 8px 30px rgba(0,0,0,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(196, 98, 45, 0.4), 0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            Ver Modelos
          </Link>

          <a
            href="https://wa.me/5493513000000"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(196, 98, 45, 0.5)',
              color: '#f5e6d3',
              padding: '0.9rem 2.25rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'rgba(196, 98, 45, 0.08)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(196, 98, 45, 0.18)'
              e.currentTarget.style.borderColor = 'rgba(196, 98, 45, 0.8)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(196, 98, 45, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(196, 98, 45, 0.5)'
            }}
          >
            Consultar por WhatsApp
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Explorar
          </span>
          <div style={{
            width: '1px', height: '48px',
            background: 'linear-gradient(to bottom, rgba(196, 98, 45, 0.6), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }} />
        </motion.div>
      </div>

      <style>{`
        @keyframes emberRise {
          0% { opacity: 0; transform: translateY(0) translateX(0) scale(1); }
          20% { opacity: 0.9; }
          80% { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-70vh) translateX(var(--drift)) scale(0.3); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }
      `}</style>
    </section>
  )
}
