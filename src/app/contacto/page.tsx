'use client'

import { Navbar } from '@/frontend/components/layout/Navbar'
import { Footer } from '@/frontend/components/layout/Footer'
import { MessageCircle, Instagram } from 'lucide-react'

export default function ContactoPage() {
  return (
    <div style={{ background: '#0f0702', minHeight: '100vh' }}>
      <Navbar />

      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '140px 1.5rem 6rem',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
            <span style={{ color: '#c4622d', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
              Contacto
            </span>
            <div style={{ width: '30px', height: '1px', background: 'rgba(196, 98, 45, 0.5)' }} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            color: '#f5e6d3',
            marginBottom: '1rem',
            lineHeight: 1.1,
          }}>
            Hablemos
          </h1>
          <p style={{ color: '#7a5c44', fontSize: '1rem', lineHeight: 1.7 }}>
            Consultanos por precios, modelos, envíos o cualquier duda que tengas.
          </p>
        </div>

        {/* Contact cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* WhatsApp */}
          <a
            href="https://wa.me/5493513000000?text=Hola!%20Me%20interesa%20un%20fogonero%20de%20El%20Mercantic"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '1.25rem',
              background: 'linear-gradient(145deg, rgba(37,211,102,0.08), rgba(37,211,102,0.03))',
              border: '1px solid rgba(37,211,102,0.25)',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(145deg, rgba(37,211,102,0.14), rgba(37,211,102,0.06))'
              e.currentTarget.style.borderColor = 'rgba(37,211,102,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(145deg, rgba(37,211,102,0.08), rgba(37,211,102,0.03))'
              e.currentTarget.style.borderColor = 'rgba(37,211,102,0.25)'
            }}
          >
            <div style={{
              width: '52px', height: '52px', flexShrink: 0, borderRadius: '50%',
              background: 'rgba(37,211,102,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageCircle size={24} style={{ color: '#25d366' }} />
            </div>
            <div>
              <div style={{ color: '#f5e6d3', fontWeight: 700, fontSize: '1.05rem', marginBottom: '2px' }}>
                WhatsApp
              </div>
              <div style={{ color: '#7a5c44', fontSize: '0.85rem' }}>
                Consultá directo — respondemos rápido
              </div>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/elmercantic/?hl=es-la"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '1.25rem',
              background: 'linear-gradient(145deg, rgba(225,48,108,0.08), rgba(225,48,108,0.03))',
              border: '1px solid rgba(225,48,108,0.2)',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(145deg, rgba(225,48,108,0.14), rgba(225,48,108,0.06))'
              e.currentTarget.style.borderColor = 'rgba(225,48,108,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(145deg, rgba(225,48,108,0.08), rgba(225,48,108,0.03))'
              e.currentTarget.style.borderColor = 'rgba(225,48,108,0.2)'
            }}
          >
            <div style={{
              width: '52px', height: '52px', flexShrink: 0, borderRadius: '50%',
              background: 'rgba(225,48,108,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Instagram size={24} style={{ color: '#e1306c' }} />
            </div>
            <div>
              <div style={{ color: '#f5e6d3', fontWeight: 700, fontSize: '1.05rem', marginBottom: '2px' }}>
                Instagram
              </div>
              <div style={{ color: '#7a5c44', fontSize: '0.85rem' }}>
                @elmercantic — seguinos para novedades
              </div>
            </div>
          </a>
        </div>

        {/* Note */}
        <p style={{ color: '#3d2415', fontSize: '0.8rem', textAlign: 'center', marginTop: '2.5rem', lineHeight: 1.7 }}>
          Fabricamos en Córdoba y enviamos a todo el país.<br />
          También podés venir a vernos personalmente.
        </p>
      </div>

      <Footer />
    </div>
  )
}
