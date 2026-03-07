'use client'

import { useEffect } from 'react'
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

function Item({ item, onRemove, onQty }: {
  item: CartItem
  onRemove: () => void
  onQty: (q: number) => void
}) {
  const displayPrice = item.salePrice ?? item.price
  const hasSale      = item.salePrice != null
  const initials     = item.productName.slice(0, 2).toUpperCase()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginBottom: '0.6rem' }}
    >
      <div style={{
        background: 'linear-gradient(148deg, rgba(38,21,12,0.9) 0%, rgba(14,7,3,0.9) 100%)',
        border: '1px solid rgba(92,53,32,0.3)',
        borderRadius: '10px',
        padding: '0.85rem 0.95rem',
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          {/* Thumbnail */}
          <div style={{
            width: '46px', height: '46px', flexShrink: 0, borderRadius: '8px',
            background: 'linear-gradient(145deg, #3a2012, #180d05)',
            border: '1px solid rgba(196,98,45,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 80%, rgba(196,98,45,0.15), transparent 70%)' }} />
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1rem', fontWeight: 900, color: 'rgba(196,98,45,0.45)', position: 'relative', zIndex: 1 }}>
              {initials}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: CREAM, fontWeight: 700, fontSize: '0.88rem', marginBottom: '2px', lineHeight: 1.2 }}>
              {item.productName}
            </div>
            <div style={{ color: '#5c3820', fontSize: '0.67rem', letterSpacing: '0.06em', marginBottom: '4px' }}>
              {item.size} · {COLOR_LABELS[item.color] ?? item.color}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: ORANGE, fontWeight: 800, fontSize: '0.92rem' }}>
                ${(displayPrice * item.quantity).toLocaleString('es-AR')}
              </span>
              {hasSale && (
                <span style={{ color: '#3d2415', fontSize: '0.67rem', textDecoration: 'line-through' }}>
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
              )}
              {item.quantity > 1 && (
                <span style={{ color: '#4a2c1a', fontSize: '0.62rem' }}>
                  (${displayPrice.toLocaleString('es-AR')} c/u)
                </span>
              )}
            </div>
          </div>

          {/* Remove */}
          <button
            onClick={onRemove}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d2415', padding: '2px', flexShrink: 0, display: 'flex', alignItems: 'center', borderRadius: '4px', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#3d2415'}
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Qty stepper */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.65rem', background: 'rgba(8,3,1,0.6)', border: '1px solid rgba(92,53,32,0.22)', borderRadius: '6px', padding: '2px', width: 'fit-content' }}>
          <StepButton onClick={() => onQty(item.quantity - 1)}><Minus size={10} /></StepButton>
          <span style={{ color: CREAM, fontWeight: 700, fontSize: '0.8rem', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
          <StepButton onClick={() => onQty(item.quantity + 1)}><Plus size={10} /></StepButton>
        </div>
      </div>
    </motion.div>
  )
}

function StepButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ width: '26px', height: '26px', borderRadius: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#7a5c44', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s, color 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(92,53,32,0.35)'; e.currentTarget.style.color = CREAM }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7a5c44' }}
    >
      {children}
    </button>
  )
}

// ── Drawer ────────────────────────────────────────────────────────────────────

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart()

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 9100, background: 'rgba(3,1,0,0.8)', backdropFilter: 'blur(3px)' }}
          />
        )}
      </AnimatePresence>

      {/* Panel — always mounted, slides in/out */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: open ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 0.8 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9101,
          width: 'min(420px, 100vw)',
          background: 'linear-gradient(170deg, #130905 0%, #0c0602 60%, #0a0401 100%)',
          borderLeft: '1px solid rgba(92,53,32,0.28)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-12px 0 60px rgba(0,0,0,0.7)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Ambient top glow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '160px', background: 'radial-gradient(ellipse at 70% 0%, rgba(196,98,45,0.08), transparent 65%)', pointerEvents: 'none' }} />

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.3rem', borderBottom: '1px solid rgba(92,53,32,0.16)', flexShrink: 0, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(196,98,45,0.1)', border: '1px solid rgba(196,98,45,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={14} style={{ color: RUST }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: CREAM, fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.01em', lineHeight: 1 }}>
                Mi Carrito
              </div>
              {itemCount > 0 && (
                <div style={{ color: '#5c3520', fontSize: '0.62rem', letterSpacing: '0.08em', marginTop: '2px' }}>
                  {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'rgba(92,53,32,0.1)', border: '1px solid rgba(92,53,32,0.2)', borderRadius: '6px', cursor: 'pointer', color: '#5c3520', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = CREAM; e.currentTarget.style.background = 'rgba(92,53,32,0.22)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5c3520'; e.currentTarget.style.background = 'rgba(92,53,32,0.1)' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Items ── */}
        <div className="cart-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0.9rem 1.1rem', WebkitOverflowScrolling: 'touch' }}>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', gap: '1.1rem', textAlign: 'center', padding: '2rem 1rem' }}
            >
              <div style={{ width: '68px', height: '68px', borderRadius: '16px', background: 'linear-gradient(145deg, rgba(42,24,14,0.6), rgba(14,7,3,0.85))', border: '1px solid rgba(92,53,32,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 80%, rgba(196,98,45,0.12), transparent 70%)' }} />
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <Flame size={26} style={{ color: 'rgba(196,98,45,0.35)' }} />
                </motion.div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: '#5c3520', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Tu carrito está vacío
                </div>
                <p style={{ color: '#3a2010', fontSize: '0.73rem', lineHeight: 1.6, maxWidth: '180px', margin: '0 auto' }}>
                  Explorá nuestros fogoneros artesanales.
                </p>
              </div>
              <Link href="/productos" onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: RUST, textDecoration: 'none', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: '1px solid rgba(196,98,45,0.28)', padding: '0.55rem 1.3rem', borderRadius: '5px', background: 'rgba(196,98,45,0.07)', transition: 'all 0.2s' }}
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
              key="footer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ padding: '1rem 1.25rem 1.4rem', borderTop: '1px solid rgba(92,53,32,0.16)', flexShrink: 0, background: 'linear-gradient(to top, rgba(6,2,1,0.98), rgba(11,5,2,0.92))' }}
            >
              {/* Subtotal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.9rem', paddingBottom: '0.9rem', borderBottom: '1px solid rgba(92,53,32,0.14)' }}>
                <div>
                  <div style={{ color: '#3d2415', fontSize: '0.57rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1px' }}>Subtotal</div>
                  <div style={{ color: '#4a2c1a', fontSize: '0.63rem' }}>{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.5rem', fontWeight: 900, background: `linear-gradient(135deg, ${ORANGE} 20%, ${GOLD} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
                  ${subtotal.toLocaleString('es-AR')}
                  <span style={{ fontSize: '0.63rem', fontWeight: 400, WebkitTextFillColor: '#4a2c1a', marginLeft: '3px' }}>ARS</span>
                </div>
              </div>

              {/* CTA */}
              <Link href="/checkout" onClick={onClose}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: `linear-gradient(135deg, ${RUST} 0%, ${ORANGE} 100%)`, color: '#fff9f5', padding: '0.9rem 1.4rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: '0 0 24px rgba(196,98,45,0.28)', transition: 'box-shadow 0.22s, transform 0.18s' }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.boxShadow = '0 0 40px rgba(196,98,45,0.48)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.boxShadow = '0 0 24px rgba(196,98,45,0.28)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Ir al checkout <ArrowRight size={13} />
              </Link>

              <p style={{ color: '#2e1a0e', fontSize: '0.61rem', textAlign: 'center', marginTop: '0.65rem', letterSpacing: '0.04em' }}>
                Envíos a todo el país · Transferencia · MP · MODO
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .cart-scroll::-webkit-scrollbar { width: 3px; }
        .cart-scroll::-webkit-scrollbar-track { background: transparent; }
        .cart-scroll::-webkit-scrollbar-thumb { background: rgba(92,53,32,0.28); border-radius: 2px; }
      `}</style>
    </>
  )
}
