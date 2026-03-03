'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Flame } from 'lucide-react'
import { CartButton } from '@/frontend/components/features/cart/CartButton'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      backgroundColor: scrolled ? 'rgba(15, 7, 2, 0.95)' : 'rgba(15, 7, 2, 0.75)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: scrolled
        ? '1px solid rgba(196, 98, 45, 0.2)'
        : '1px solid rgba(196, 98, 45, 0.08)',
    }}>
      <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Main bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{
              width: '30px', height: '30px',
              background: 'radial-gradient(circle at 50% 70%, #e8783a, #c4622d, #3d2415)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(232, 120, 58, 0.5)',
              flexShrink: 0,
            }}>
              <Flame size={15} color="#f5e6d3" fill="#f5e6d3" />
            </div>
            <span style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#f5e6d3',
              letterSpacing: '0.02em',
            }}>
              El Mercantic
            </span>
          </Link>

          {/* Desktop links */}
          <div className="nav-desktop" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            {[
              { href: '/', label: 'Inicio' },
              { href: '/productos', label: 'Modelos' },
              { href: '#contacto', label: 'Contacto' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                color: '#c4a882',
                textDecoration: 'none',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e8783a')}
                onMouseLeave={e => (e.currentTarget.style.color = '#c4a882')}
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
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 0 16px rgba(196, 98, 45, 0.3)',
              }}
            >
              Consultar
            </a>
            <CartButton />
          </div>

          {/* Mobile: Cart + WhatsApp CTA + hamburger */}
          <div className="nav-mobile" style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}>
            <CartButton />
            <a
              href="https://wa.me/5493513000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #c4622d, #e8783a)',
                color: '#f5e6d3',
                padding: '0.45rem 0.9rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              Consultar
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#f5e6d3', padding: '0.4rem',
                display: 'flex', alignItems: 'center',
              }}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid rgba(196, 98, 45, 0.15)',
            padding: '1.25rem 0 1.5rem',
            display: 'flex', flexDirection: 'column', gap: '1rem',
            background: 'rgba(15, 7, 2, 0.98)',
          }}>
            {[
              { href: '/', label: 'Inicio' },
              { href: '/productos', label: 'Modelos' },
              { href: '#contacto', label: 'Contacto' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: '#c4a882', textDecoration: 'none',
                  fontSize: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                  fontWeight: 500, padding: '0.25rem 0',
                }}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://wa.me/5493513000000"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              style={{
                background: 'linear-gradient(135deg, #c4622d, #e8783a)',
                color: '#f5e6d3', padding: '0.85rem 1.5rem',
                borderRadius: '4px', textDecoration: 'none', fontWeight: 700,
                textAlign: 'center', letterSpacing: '0.06em', textTransform: 'uppercase',
                marginTop: '0.25rem',
              }}
            >
              Consultar por WhatsApp
            </a>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile { display: none !important; }
        }
      `}</style>
    </header>
  )
}
