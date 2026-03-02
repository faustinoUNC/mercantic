'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Flame } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.4s ease',
        backgroundColor: scrolled ? 'rgba(15, 7, 2, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(196, 98, 45, 0.15)' : '1px solid transparent',
      }}
    >
      <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'radial-gradient(circle at 50% 70%, #e8783a, #c4622d, #3d2415)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(232, 120, 58, 0.5)',
            }}>
              <Flame size={16} color="#f5e6d3" fill="#f5e6d3" />
            </div>
            <span style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#f5e6d3',
              letterSpacing: '0.02em',
            }}>
              El Mercantic
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="hidden-mobile">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/productos', label: 'Modelos' },
              { href: '#contacto', label: 'Contacto' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                color: '#c4a882',
                textDecoration: 'none',
                fontSize: '0.9rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#e8783a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#c4a882')}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://wa.me/5493513000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #c4622d, #e8783a)',
                color: '#f5e6d3',
                padding: '0.5rem 1.25rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'opacity 0.2s, box-shadow 0.2s',
                boxShadow: '0 0 16px rgba(196, 98, 45, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.85'
                e.currentTarget.style.boxShadow = '0 0 24px rgba(196, 98, 45, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(196, 98, 45, 0.3)'
              }}
            >
              Consultar
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#f5e6d3', padding: '0.5rem',
              display: 'none',
            }}
            className="show-mobile"
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid rgba(196, 98, 45, 0.2)',
            padding: '1.5rem 0',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
            background: 'rgba(15, 7, 2, 0.98)',
          }}>
            {[
              { href: '/', label: 'Inicio' },
              { href: '/productos', label: 'Modelos' },
              { href: '#contacto', label: 'Contacto' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                onClick={() => setMenuOpen(false)}
                style={{ color: '#c4a882', textDecoration: 'none', fontSize: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://wa.me/5493513000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #c4622d, #e8783a)',
                color: '#f5e6d3', padding: '0.75rem 1.5rem',
                borderRadius: '4px', textDecoration: 'none', fontWeight: 600,
                textAlign: 'center', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}
            >
              Consultar por WhatsApp
            </a>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  )
}
