'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Flame } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, type CartItem } from '@/frontend/context/CartContext'

const COLOR_LABELS: Record<string, string> = { negro: 'Negro', oxido: 'Óxido' }
const ORANGE = '#e8783a'
const GOLD   = '#d4a55a'
const RUST   = '#c4622d'
const CREAM  = '#f5e6d3'

// ── Item card ─────────────────────────────────────────────────────────────────

function Item({ item, onRemove, onQty }: { item: CartItem; onRemove: () => void; onQty: (q: number) => void }) {
  const displayPrice = item.salePrice ?? item.price
  const hasSale      = item.salePrice != null
  const initials     = item.productName.slice(0, 2).toUpperCase()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{
        background: 'linear-gradient(148deg, rgba(38,21,12,0.8) 0%, rgba(14,7,3,0.8) 100%)',
        border: '1px solid rgba(92,53,32,0.28)', borderRadius: '11px',
        padding: '0.9rem 1rem', marginBottom: '0.65rem',
      }}>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
          {/* Thumbnail */}
          <div style={{
            width: '50px', height: '50px', flexShrink: 0, borderRadius: '8px',
            background: 'linear-gradient(145deg, #3a2012, #180d05)',
            border: '1px solid rgba(196,98,45,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 85%, rgba(196,98,45,0.18), transparent 70%)' }} />
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.05rem', fontWeight: 900, color: 'rgba(196,98,45,0.5)', position: 'relative', zIndex: 1 }}>
              {initials}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: CREAM, fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px', lineHeight: 1.2 }}>
              {item.productName}
            </div>
            <div style={{ color: '#5c3820', fontSize: '0.68rem', letterSpacing: '0.07em', marginBottom: '4px' }}>
              {item.size.replace('.', ',')} · {COLOR_LABELS[item.color] ?? item.color}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: ORANGE, fontWeight: 800, fontSize: '0.95rem' }}>
                ${(displayPrice * item.quantity).toLocaleString('es-AR')}
              </span>
              {hasSale && (
                <span style={{ color: '#3d2415', fontSize: '0.68rem', textDecoration: 'line-through' }}>
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
              )}
              {item.quantity > 1 && (
                <span style={{ color: '#4a2c1a', fontSize: '0.63rem' }}>
                  ${displayPrice.toLocaleString('es-AR')} c/u
                </span>
              )}
            </div>
          </div>

          {/* Remove */}
          <motion.button
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.88 }}
            onClick={onRemove}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#3d2415',
              padding: '3px', flexShrink: 0, display: 'flex', alignItems: 'center',
              borderRadius: '5px', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#3d2415'}
          >
            <Trash2 size={13} />
          </motion.button>
        </div>

        {/* Qty stepper */}
        <div style={{
          display: 'flex', alignItems: 'center', marginTop: '0.7rem',
          background: 'rgba(8,3,1,0.55)', border: '1px solid rgba(92,53,32,0.25)',
          borderRadius: '7px', padding: '2px', width: 'fit-content',
        }}>
          <StepButton onClick={() => onQty(item.quantity - 1)}><Minus size={10} /></StepButton>
          <span style={{ color: CREAM, fontWeight: 700, fontSize: '0.82rem', minWidth: '26px', textAlign: 'center' }}>
            {item.quantity}
          </span>
          <StepButton onClick={() => onQty(item.quantity + 1)}><Plus size={10} /></StepButton>
        </div>
      </div>
    </motion.div>
  )
}

function StepButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.82 }} onClick={onClick}
      style={{
        width: '26px', height: '26px', borderRadius: '5px',
        background: 'transparent', border: 'none', cursor: 'pointer', color: '#7a5c44',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s, color 0.18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(92,53,32,0.38)'; e.currentTarget.style.color = CREAM }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7a5c44' }}
    >
      {children}
    </motion.button>
  )
}

// ── Drawer ────────────────────────────────────────────────────────────────────

interface CartDrawerProps { open: boolean; onClose: () => void }

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const panelStyle = isMobile
    ? {
        position: 'fixed' as const, bottom: 0, left: 0, right: 0, zIndex: 101,
        maxHeight: '88dvh',
        background: 'linear-gradient(170deg, #130905 0%, #0c0602 60%, #0a0401 100%)',
        borderRadius: '18px 18px 0 0',
        borderTop: '1px solid rgba(92,53,32,0.3)',
        display: 'flex', flexDirection: 'column' as const,
        boxShadow: '0 -16px 60px rgba(0,0,0,0.8)',
      }
    : {
        position: 'fixed' as const, top: 0, right: 0, bottom: 0, zIndex: 101,
        width: 'min(440px, 100vw)',
        background: 'linear-gradient(170deg, #130905 0%, #0c0602 60%, #0a0401 100%)',
        borderLeft: '1px solid rgba(92,53,32,0.3)',
        display: 'flex', flexDirection: 'column' as const,
        boxShadow: '-16px 0 80px rgba(0,0,0,0.8)',
      }

  const animateProps = isMobile
    ? { animate: { y: open ? 0 : '100%' }, transition: { type: 'spring' as const, stiffness: 300, damping: 32, mass: 0.9 } }
    : { animate: { x: open ? 0 : '100%' }, transition: { type: 'spring' as const, stiffness: 310, damping: 33, mass: 0.85 } }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        onClick={onClose}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(3,1,0,0.78)',
          backdropFilter: open ? 'blur(4px)' : 'none',
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Panel */}
      <motion.div style={panelStyle} {...animateProps}>
        {/* Top ambient glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0, left: 0, height: '180px',
          background: 'radial-gradient(ellipse at 70% 0%, rgba(196,98,45,0.08) 0%, transparent 65%)',
          pointerEvents: 'none', borderRadius: 'inherit',
        }} />

        {/* Mobile drag handle */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(92,53,32,0.4)' }} />
          </div>
        )}

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '0.9rem 1.4rem' : '1.3rem 1.6rem',
          borderBottom: '1px solid rgba(92,53,32,0.18)',
          flexShrink: 0, position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'linear-gradient(145deg, rgba(196,98,45,0.16), rgba(196,98,45,0.05))',
              border: '1px solid rgba(196,98,45,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingBag size={15} style={{ color: RUST }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: CREAM, fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.01em', lineHeight: 1 }}>
                Mi Carrito
              </div>
              <AnimatePresence mode="wait">
                {itemCount > 0 && (
                  <motion.div key={itemCount} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                    style={{ color: '#5c3520', fontSize: '0.65rem', letterSpacing: '0.1em', marginTop: '2px' }}>
                    {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            whileHover={{ rotate: 90 }} whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onClick={onClose}
            style={{
              background: 'rgba(92,53,32,0.1)', border: '1px solid rgba(92,53,32,0.22)',
              borderRadius: '7px', cursor: 'pointer', color: '#5c3520',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.2s, border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = CREAM; e.currentTarget.style.borderColor = 'rgba(92,53,32,0.45)'; e.currentTarget.style.background = 'rgba(92,53,32,0.22)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5c3520'; e.currentTarget.style.borderColor = 'rgba(92,53,32,0.22)'; e.currentTarget.style.background = 'rgba(92,53,32,0.1)' }}
          >
            <X size={15} />
          </motion.button>
        </div>

        {/* ── Items ── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: isMobile ? '1rem 1.1rem' : '1.1rem 1.4rem',
          WebkitOverflowScrolling: 'touch',
        }}>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1.25rem', padding: '3rem 1rem', textAlign: 'center', minHeight: '260px' }}
            >
              <div style={{ width: '72px', height: '72px', borderRadius: '16px', background: 'linear-gradient(145deg, rgba(42,24,14,0.6), rgba(14,7,3,0.85))', border: '1px solid rgba(92,53,32,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 80%, rgba(196,98,45,0.12), transparent 70%)' }} />
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <Flame size={28} style={{ color: 'rgba(196,98,45,0.35)' }} />
                </motion.div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: '#5c3520', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Tu carrito está vacío
                </div>
                <p style={{ color: '#3a2010', fontSize: '0.75rem', lineHeight: 1.65, maxWidth: '190px', margin: '0 auto' }}>
                  Explorá nuestros fogoneros artesanales.
                </p>
              </div>
              <Link href="/productos" onClick={onClose} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', color: RUST,
                textDecoration: 'none', fontSize: '0.7rem', fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                border: '1px solid rgba(196,98,45,0.28)', padding: '0.6rem 1.4rem', borderRadius: '6px',
                background: 'rgba(196,98,45,0.07)', transition: 'all 0.22s',
              }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'rgba(196,98,45,0.14)'; e.currentTarget.style.color = CREAM }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'rgba(196,98,45,0.07)'; e.currentTarget.style.color = RUST }}
              >
                Ver modelos <ArrowRight size={11} />
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map(item => (
                <Item key={item.variantId} item={item} onRemove={() => removeItem(item.variantId)} onQty={q => updateQuantity(item.variantId, q)} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* ── Footer ── */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28 }}
              style={{
                padding: isMobile ? '1rem 1.25rem 1.5rem' : '1.25rem 1.5rem 1.6rem',
                borderTop: '1px solid rgba(92,53,32,0.18)',
                flexShrink: 0,
                background: 'linear-gradient(to top, rgba(6,2,1,0.98) 0%, rgba(11,5,2,0.9) 100%)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(92,53,32,0.15)' }}>
                <div>
                  <div style={{ color: '#3d2415', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '2px' }}>Subtotal</div>
                  <div style={{ color: '#4a2c1a', fontSize: '0.65rem' }}>{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.55rem', fontWeight: 900, background: `linear-gradient(135deg, ${ORANGE} 20%, ${GOLD} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
                  ${subtotal.toLocaleString('es-AR')}
                  <span style={{ fontSize: '0.65rem', fontWeight: 400, WebkitTextFillColor: '#4a2c1a', marginLeft: '4px' }}>ARS</span>
                </div>
              </div>

              <Link href="/checkout" onClick={onClose} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: `linear-gradient(135deg, ${RUST} 0%, ${ORANGE} 100%)`,
                color: '#fff9f5', padding: '0.95rem 1.5rem',
                borderRadius: '9px', textDecoration: 'none',
                fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                boxShadow: `0 0 28px rgba(196,98,45,0.3)`, transition: 'box-shadow 0.25s, transform 0.22s',
              }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.boxShadow = `0 0 44px rgba(196,98,45,0.5)`; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.boxShadow = `0 0 28px rgba(196,98,45,0.3)`; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Ir al checkout <ArrowRight size={14} />
              </Link>

              <p style={{ color: '#2e1a0e', fontSize: '0.63rem', textAlign: 'center', marginTop: '0.75rem', letterSpacing: '0.05em' }}>
                Envíos a todo el país · Transferencia · MP · MODO
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
