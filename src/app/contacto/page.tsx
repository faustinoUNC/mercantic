'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/frontend/components/layout/Navbar'
import { Footer } from '@/frontend/components/layout/Footer'
import { Flame, MapPin, Clock, ArrowLeft, Instagram } from 'lucide-react'

const WA_URL = 'https://wa.me/5493513000000?text=Hola!%20Me%20interesa%20un%20fogonero%20de%20El%20Mercantic'
const IG_URL = 'https://www.instagram.com/elmercantic/?hl=es-la'

export default function ContactoPage() {
  return (
    <div style={{ background: '#0f0702', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(196,98,45,0.1) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '-10%',
        width: '400px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(196,98,45,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: 'clamp(100px, 16vw, 140px) 1.5rem 5rem', position: 'relative' }}>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#5c3520', textDecoration: 'none', fontSize: '0.82rem',
            marginBottom: '3rem', letterSpacing: '0.02em',
          }}>
            <ArrowLeft size={13} /> Inicio
          </Link>
        </motion.div>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          {/* Flame icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '56px', height: '56px',
              background: 'radial-gradient(circle at 50% 70%, #e8783a, #c4622d, #3d2415)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 36px rgba(232, 120, 58, 0.4), 0 0 72px rgba(196, 98, 45, 0.15)',
            }}>
              <Flame size={24} color="#f5e6d3" fill="#f5e6d3" />
            </div>
          </div>

          {/* Overline */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ width: '36px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
            <span style={{ color: '#c4622d', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600 }}>
              Contacto
            </span>
            <div style={{ width: '36px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            background: 'linear-gradient(135deg, #f5e6d3 0%, #d4a55a 55%, #e8783a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
          }}>
            Hablemos.
          </h1>
          <p style={{
            color: '#7a5c44',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            lineHeight: 1.8,
            maxWidth: '380px',
            margin: '0 auto',
          }}>
            Consultanos por precios, modelos, envíos<br />o cualquier duda que tengas.
          </p>
        </motion.div>

        {/* ── Contact cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>

          {/* WhatsApp */}
          <motion.a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            whileHover={{ scale: 1.012 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '1.25rem',
              background: 'rgba(10, 22, 14, 0.8)',
              border: '1px solid rgba(37,211,102,0.18)',
              borderRadius: '14px',
              padding: '1.4rem 1.75rem',
              textDecoration: 'none',
              backdropFilter: 'blur(6px)',
              transition: 'border-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(37,211,102,0.45)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(37,211,102,0.18)')}
          >
            <div style={{
              width: '52px', height: '52px', flexShrink: 0, borderRadius: '12px',
              background: 'rgba(37,211,102,0.1)',
              border: '1px solid rgba(37,211,102,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" fill="#25d366" width="26" height="26" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#f5e6d3', fontWeight: 700, fontSize: '1rem', marginBottom: '3px' }}>
                WhatsApp
              </div>
              <div style={{ color: '#4a7a5c', fontSize: '0.83rem' }}>
                Consultá directo — respondemos rápido
              </div>
            </div>
            <div style={{ color: 'rgba(37,211,102,0.35)', fontSize: '1.1rem', flexShrink: 0, fontWeight: 300 }}>›</div>
          </motion.a>

          {/* Instagram */}
          <motion.a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            whileHover={{ scale: 1.012 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '1.25rem',
              background: 'rgba(18, 8, 14, 0.8)',
              border: '1px solid rgba(225,48,108,0.15)',
              borderRadius: '14px',
              padding: '1.4rem 1.75rem',
              textDecoration: 'none',
              backdropFilter: 'blur(6px)',
              transition: 'border-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(225,48,108,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(225,48,108,0.15)')}
          >
            <div style={{
              width: '52px', height: '52px', flexShrink: 0, borderRadius: '12px',
              background: 'rgba(225,48,108,0.08)',
              border: '1px solid rgba(225,48,108,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Instagram size={24} style={{ color: '#e1306c' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#f5e6d3', fontWeight: 700, fontSize: '1rem', marginBottom: '3px' }}>
                Instagram
              </div>
              <div style={{ color: '#7a4a5c', fontSize: '0.83rem' }}>
                @elmercantic — seguinos para novedades
              </div>
            </div>
            <div style={{ color: 'rgba(225,48,108,0.3)', fontSize: '1.1rem', flexShrink: 0, fontWeight: 300 }}>›</div>
          </motion.a>
        </div>

        {/* ── Info chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}
        >
          {[
            { icon: MapPin, label: 'Ubicación', value: 'Córdoba, Argentina' },
            { icon: Clock,  label: 'Respuesta', value: 'En menos de 24hs' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              background: 'rgba(45,26,14,0.4)',
              border: '1px solid rgba(92,53,32,0.25)',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
            }}>
              <Icon size={16} style={{ color: '#c4622d', flexShrink: 0 }} />
              <div>
                <div style={{ color: '#5c3520', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
                <div style={{ color: '#c4a882', fontSize: '0.83rem', fontWeight: 500 }}>{value}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Bottom note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          style={{ color: '#3d2415', fontSize: '0.78rem', textAlign: 'center', marginTop: '2.5rem', lineHeight: 1.85 }}
        >
          Fabricamos en Córdoba y enviamos a todo el país.<br />
          También podés venir a vernos personalmente.
        </motion.p>
      </div>

      <Footer />
    </div>
  )
}
