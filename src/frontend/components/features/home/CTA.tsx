'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Mail } from 'lucide-react'

export function CTA() {
  return (
    <section id="contacto" style={{
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(to bottom, #0f0702 0%, #1a0c05 50%, #0f0702 100%)',
    }}>
      {/* Large background glow — the main fire */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw', height: '60vh',
        background: 'radial-gradient(ellipse at center, rgba(196, 98, 45, 0.12) 0%, rgba(212, 165, 90, 0.04) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Decorative horizontal lines */}
      {[0.2, 0.5, 0.8].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${pos * 100}%`,
          left: 0, right: 0,
          height: '1px',
          background: `linear-gradient(to right, transparent, rgba(196, 98, 45, ${0.06 + i * 0.02}), transparent)`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}
        >
          <div style={{ width: '40px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
          <span style={{ color: '#c4622d', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
            El Mercantic Fogoneros
          </span>
          <div style={{ width: '40px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ color: '#f5e6d3' }}>¿Listo para</span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #e8783a 50%, #c4622d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(232, 120, 58, 0.3))',
          }}>
            encender el fuego?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            color: '#7a5c44',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto 3rem',
          }}
        >
          Consultanos por WhatsApp para ver disponibilidad, tiempos de entrega y opciones de pago.
          Respondemos rápido.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="cta-buttons"
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <a
            href="https://wa.me/5493513000000?text=Hola!%20Me%20interesa%20un%20fogonero%20El%20Mercantic"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #c4622d, #e8783a)',
              color: '#f5e6d3',
              padding: '1rem 2.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 0 40px rgba(196, 98, 45, 0.35), 0 8px 30px rgba(0,0,0,0.5)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 0 60px rgba(196, 98, 45, 0.5), 0 12px 40px rgba(0,0,0,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(196, 98, 45, 0.35), 0 8px 30px rgba(0,0,0,0.5)'
            }}
          >
            <MessageCircle size={18} />
            Consultar por WhatsApp
          </a>

          <a
            href="mailto:contacto@elmercantic.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid rgba(196, 98, 45, 0.4)',
              color: '#c4a882',
              padding: '1rem 2rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              letterSpacing: '0.06em',
              background: 'rgba(196, 98, 45, 0.06)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(196, 98, 45, 0.7)'
              e.currentTarget.style.color = '#f5e6d3'
              e.currentTarget.style.background = 'rgba(196, 98, 45, 0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(196, 98, 45, 0.4)'
              e.currentTarget.style.color = '#c4a882'
              e.currentTarget.style.background = 'rgba(196, 98, 45, 0.06)'
            }}
          >
            <Mail size={18} />
            Enviar Email
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop: '3.5rem',
            display: 'flex',
            gap: '2.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            'Envíos a todo el país',
            'Pago en cuotas',
            'Fabricación artesanal',
          ].map((item) => (
            <div key={item} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#5c3520',
            }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#c4622d' }} />
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          #contacto .cta-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 0 0.5rem;
          }
          #contacto .cta-buttons a {
            justify-content: center !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}
