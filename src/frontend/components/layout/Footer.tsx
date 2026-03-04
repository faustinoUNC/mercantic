'use client'

import Link from 'next/link'
import { Flame } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{
      background: '#0f0702',
      borderTop: '1px solid rgba(92, 53, 32, 0.3)',
      padding: '3rem 1.5rem 2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{
                width: '28px', height: '28px',
                background: 'radial-gradient(circle at 50% 70%, #e8783a, #c4622d, #3d2415)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 10px rgba(232, 120, 58, 0.4)',
              }}>
                <Flame size={14} color="#f5e6d3" fill="#f5e6d3" />
              </div>
              <span style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#f5e6d3',
              }}>
                El Mercantic
              </span>
            </div>
            <p style={{ color: '#5c3520', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '220px' }}>
              Fogoneros artesanales de alta calidad. Forjados para durar toda la vida.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Navegación
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/', label: 'Inicio' },
                { href: '/productos', label: 'Modelos' },
                { href: '/productos/t-rex', label: 'T-REX' },
                { href: '/productos/raptor', label: 'RAPTOR' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  color: '#5c3520', textDecoration: 'none', fontSize: '0.875rem',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#c4a882')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#5c3520')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#7a5c44', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Contacto
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <a href="https://wa.me/5493513000000" target="_blank" rel="noopener noreferrer"
                style={{ color: '#5c3520', textDecoration: 'none', fontSize: '0.875rem' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c4a882')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#5c3520')}
              >
                WhatsApp
              </a>
              <a href="https://www.instagram.com/elmercantic/?hl=es-la" target="_blank" rel="noopener noreferrer"
                style={{ color: '#5c3520', textDecoration: 'none', fontSize: '0.875rem' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c4a882')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#5c3520')}
              >
                Instagram
              </a>
              <a href="mailto:contacto@elmercantic.com"
                style={{ color: '#5c3520', textDecoration: 'none', fontSize: '0.875rem' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c4a882')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#5c3520')}
              >
                contacto@elmercantic.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(92, 53, 32, 0.2)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <span style={{ color: '#3d2415', fontSize: '0.75rem' }}>
            © 2025 El Mercantic Fogoneros. Todos los derechos reservados.
          </span>
          <Link href="/admin" style={{ color: '#2d1a0e', fontSize: '0.7rem', textDecoration: 'none' }}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
