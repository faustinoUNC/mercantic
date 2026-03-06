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

function Item({
  item,
  onRemove,
  onQty,
}: {
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
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.22 } }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{
        background:     'linear-gradient(148deg, rgba(38,21,12,0.75) 0%, rgba(14,7,3,0.75) 100%)',
        border:         '1px solid rgba(92,53,32,0.28)',
        borderRadius:   '11px',
        padding:        '1rem 1.1rem',
        marginBottom:   '0.7rem',
        backdropFilter: 'blur(6px)',
      }}>
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>

          {/* Thumbnail */}
          <div style={{
            width: '52px', height: '52px', flexShrink: 0,
            borderRadius: '9px',
            background:   'linear-gradient(145deg, #3a2012, #180d05)',
            border:       '1px solid rgba(196,98,45,0.22)',
            display:      'flex', alignItems: 'center', justifyContent: 'center',
            position:     'relative', overflow: 'hidden',
          }}>
            <div style={{
              position:   'absolute', inset: 0,
              background: 'radial-gradient(circle at 50% 85%, rgba(196,98,45,0.18), transparent 70%)',
            }} />
            <span style={{
              fontFamily:    'var(--font-playfair), Georgia, serif',
              fontSize:      '1.15rem', fontWeight: 900,
              color:         'rgba(196,98,45,0.5)',
              letterSpacing: '-0.03em', position: 'relative', zIndex: 1,
            }}>
              {initials}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Name */}
            <div style={{
              fontFamily:    'var(--font-playfair), Georgia, serif',
              color:         CREAM, fontWeight: 700,
              fontSize:      '0.95rem', marginBottom: '2px',
              letterSpacing: '-0.01em', lineHeight: 1.2,
            }}>
              {item.productName}
            </div>
            {/* Variant */}
            <div style={{
              color:         '#5c3820', fontSize: '0.7rem',
              letterSpacing: '0.07em', marginBottom: '5px',
            }}>
              {item.size.replace('.', ',')} · {COLOR_LABELS[item.color] ?? item.color}
            </div>
            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                color:      ORANGE, fontWeight: 800, fontSize: '1rem',
              }}>
                ${(displayPrice * item.quantity).toLocaleString('es-AR')}
              </span>
              {hasSale && (
                <span style={{ color: '#3d2415', fontSize: '0.7rem', textDecoration: 'line-through' }}>
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
              )}
              {item.quantity > 1 && (
                <span style={{ color: '#4a2c1a', fontSize: '0.66rem' }}>
                  ${displayPrice.toLocaleString('es-AR')} c/u
                </span>
              )}
            </div>
          </div>

          {/* Remove */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            onClick={onRemove}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color:       '#3d2415', padding: '3px', flexShrink: 0,
              display:     'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '5px', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#3d2415'}
          >
            <Trash2 size={14} />
          </motion.button>
        </div>

        {/* Qty stepper */}
        <div style={{
          display:      'flex', alignItems: 'center',
          marginTop:    '0.8rem',
          background:   'rgba(8,3,1,0.55)',
          border:       '1px solid rgba(92,53,32,0.25)',
          borderRadius: '7px', padding: '3px',
          width:        'fit-content', gap: '0',
        }}>
          <StepButton onClick={() => onQty(item.quantity - 1)}>
            <Minus size={11} />
          </StepButton>
          <span style={{
            color:     CREAM, fontWeight: 700, fontSize: '0.85rem',
            minWidth:  '28px', textAlign: 'center',
          }}>
            {item.quantity}
          </span>
          <StepButton onClick={() => onQty(item.quantity + 1)}>
            <Plus size={11} />
          </StepButton>
        </div>
      </div>
    </motion.div>
  )
}

function StepButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.82 }}
      onClick={onClick}
      style={{
        width: '28px', height: '28px', borderRadius: '5px',
        background: 'transparent', border: 'none',
        cursor:      'pointer', color: '#7a5c44',
        display:     'flex', alignItems: 'center', justifyContent: 'center',
        transition:  'background 0.18s, color 0.18s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(92,53,32,0.38)'
        e.currentTarget.style.color      = CREAM
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color      = '#7a5c44'
      }}
    >
      {children}
    </motion.button>
  )
}

// ── Drawer ────────────────────────────────────────────────────────────────────

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        onClick={onClose}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28 }}
        style={{
          position:       'fixed', inset: 0, zIndex: 100,
          background:     'rgba(3,1,0,0.78)',
          backdropFilter: open ? 'blur(4px)' : 'none',
          pointerEvents:  open ? 'auto' : 'none',
        }}
      />

      {/* Panel */}
      <motion.div
        animate={{ x: open ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 310, damping: 33, mass: 0.85 }}
        style={{
          position:      'fixed', top: 0, right: 0, bottom: 0, zIndex: 101,
          width:         'min(440px, 100vw)',
          background:    'linear-gradient(170deg, #130905 0%, #0c0602 60%, #0a0401 100%)',
          borderLeft:    '1px solid rgba(92,53,32,0.3)',
          display:       'flex', flexDirection: 'column',
          boxShadow:     '-16px 0 80px rgba(0,0,0,0.8), -1px 0 0 rgba(196,98,45,0.06)',
        }}
      >
        {/* Top ambient glow */}
        <div style={{
          position:      'absolute', top: 0, right: 0, left: 0, height: '220px',
          background:    'radial-gradient(ellipse at 70% 0%, rgba(196,98,45,0.09) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div style={{
          display:        'flex', alignItems: 'center', justifyContent: 'space-between',
          padding:        '1.4rem 1.6rem',
          borderBottom:   '1px solid rgba(92,53,32,0.18)',
          flexShrink:     0, position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Icon box */}
            <div style={{
              width:      '38px', height: '38px', borderRadius: '9px',
              background: 'linear-gradient(145deg, rgba(196,98,45,0.16), rgba(196,98,45,0.05))',
              border:     '1px solid rgba(196,98,45,0.22)',
              display:    'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingBag size={16} style={{ color: RUST }} />
            </div>

            <div>
              <div style={{
                fontFamily:    'var(--font-playfair), Georgia, serif',
                color:         CREAM, fontWeight: 900,
                fontSize:      '1.1rem', letterSpacing: '-0.01em', lineHeight: 1,
              }}>
                Mi Carrito
              </div>
              <AnimatePresence mode="wait">
                {itemCount > 0 && (
                  <motion.div
                    key={itemCount}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      color:         '#5c3520', fontSize: '0.67rem',
                      letterSpacing: '0.1em', marginTop: '2px',
                    }}
                  >
                    {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Close */}
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onClick={onClose}
            style={{
              background:   'rgba(92,53,32,0.1)',
              border:       '1px solid rgba(92,53,32,0.22)',
              borderRadius: '7px', cursor: 'pointer', color: '#5c3520',
              width:        '34px', height: '34px',
              display:      'flex', alignItems: 'center', justifyContent: 'center',
              transition:   'color 0.2s, border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color        = CREAM
              e.currentTarget.style.borderColor  = 'rgba(92,53,32,0.45)'
              e.currentTarget.style.background   = 'rgba(92,53,32,0.22)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color        = '#5c3520'
              e.currentTarget.style.borderColor  = 'rgba(92,53,32,0.22)'
              e.currentTarget.style.background   = 'rgba(92,53,32,0.1)'
            }}
          >
            <X size={16} />
          </motion.button>
        </div>

        {/* ── Items ──────────────────────────────────────────────────── */}
        <div style={{
          flex:          1, overflowY: 'auto',
          padding:       '1.15rem 1.5rem',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(92,53,32,0.3) transparent',
        }}>
          {items.length === 0 ? (
            // ── Empty state ────────────────────────────────────────
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display:        'flex', flexDirection: 'column',
                alignItems:     'center', justifyContent: 'center',
                height:         '100%', gap: '1.4rem',
                padding:        '4rem 1.5rem', textAlign: 'center',
              }}
            >
              {/* Animated icon */}
              <div style={{
                width:      '76px', height: '76px', borderRadius: '18px',
                background: 'linear-gradient(145deg, rgba(42,24,14,0.6), rgba(14,7,3,0.85))',
                border:     '1px solid rgba(92,53,32,0.28)',
                display:    'flex', alignItems: 'center', justifyContent: 'center',
                position:   'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position:   'absolute', inset: 0,
                  background: 'radial-gradient(circle at 50% 80%, rgba(196,98,45,0.12), transparent 70%)',
                }} />
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Flame size={30} style={{ color: 'rgba(196,98,45,0.35)' }} />
                </motion.div>
              </div>

              <div>
                <div style={{
                  fontFamily:   'var(--font-playfair), Georgia, serif',
                  color:        '#5c3520', fontSize: '1rem',
                  fontWeight:   700, marginBottom: '0.45rem',
                }}>
                  Tu carrito está vacío
                </div>
                <p style={{
                  color:    '#3a2010', fontSize: '0.78rem',
                  lineHeight: 1.65, maxWidth: '200px', margin: '0 auto',
                }}>
                  Explorá nuestros fogoneros artesanales.
                </p>
              </div>

              <Link
                href="/productos"
                onClick={onClose}
                style={{
                  display:       'inline-flex', alignItems: 'center', gap: '6px',
                  color:         RUST, textDecoration: 'none',
                  fontSize:      '0.72rem', fontWeight: 700,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  border:        '1px solid rgba(196,98,45,0.28)',
                  padding:       '0.65rem 1.5rem', borderRadius: '6px',
                  background:    'rgba(196,98,45,0.07)',
                  transition:    'all 0.22s',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.background   = 'rgba(196,98,45,0.14)'
                  e.currentTarget.style.borderColor  = 'rgba(196,98,45,0.5)'
                  e.currentTarget.style.color        = CREAM
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.background   = 'rgba(196,98,45,0.07)'
                  e.currentTarget.style.borderColor  = 'rgba(196,98,45,0.28)'
                  e.currentTarget.style.color        = RUST
                }}
              >
                Ver modelos <ArrowRight size={12} />
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map(item => (
                <Item
                  key={item.variantId}
                  item={item}
                  onRemove={() => removeItem(item.variantId)}
                  onQty={(q) => updateQuantity(item.variantId, q)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding:        '1.35rem 1.6rem 1.7rem',
                borderTop:      '1px solid rgba(92,53,32,0.18)',
                flexShrink:     0,
                background:     'linear-gradient(to top, rgba(6,2,1,0.98) 0%, rgba(11,5,2,0.9) 100%)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Subtotal row */}
              <div style={{
                display:         'flex',
                justifyContent:  'space-between',
                alignItems:      'flex-end',
                marginBottom:    '1.2rem',
                paddingBottom:   '1.1rem',
                borderBottom:    '1px solid rgba(92,53,32,0.15)',
              }}>
                <div>
                  <div style={{
                    color: '#3d2415', fontSize: '0.6rem',
                    letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '2px',
                  }}>
                    Subtotal
                  </div>
                  <div style={{ color: '#4a2c1a', fontSize: '0.68rem' }}>
                    {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                  </div>
                </div>

                <div style={{
                  fontFamily:           'var(--font-playfair), Georgia, serif',
                  fontSize:             '1.65rem', fontWeight: 900,
                  background:           `linear-gradient(135deg, ${ORANGE} 20%, ${GOLD} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip:       'text',
                  lineHeight:           1,
                }}>
                  ${subtotal.toLocaleString('es-AR')}
                  <span style={{
                    fontSize:             '0.7rem', fontWeight: 400,
                    WebkitTextFillColor:  '#4a2c1a',
                    marginLeft:           '4px', letterSpacing: '0.05em',
                  }}>
                    ARS
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                onClick={onClose}
                style={{
                  display:        'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background:     `linear-gradient(135deg, ${RUST} 0%, ${ORANGE} 100%)`,
                  color:          '#fff9f5',
                  padding:        '1rem 1.5rem',
                  borderRadius:   '9px', textDecoration: 'none',
                  fontWeight:     700, fontSize: '0.82rem',
                  letterSpacing:  '0.12em', textTransform: 'uppercase',
                  boxShadow:      `0 0 32px rgba(196,98,45,0.32), inset 0 1px 0 rgba(255,255,255,0.1)`,
                  transition:     'box-shadow 0.28s ease, transform 0.25s ease',
                  position:       'relative', overflow: 'hidden',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.boxShadow = `0 0 50px rgba(196,98,45,0.52), inset 0 1px 0 rgba(255,255,255,0.14)`
                  e.currentTarget.style.transform = 'translateY(-1.5px)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.boxShadow = `0 0 32px rgba(196,98,45,0.32), inset 0 1px 0 rgba(255,255,255,0.1)`
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Ir al checkout <ArrowRight size={15} />
              </Link>

              <p style={{
                color:         '#2e1a0e', fontSize: '0.66rem', textAlign: 'center',
                marginTop:     '0.85rem', letterSpacing: '0.05em', lineHeight: 1.6,
              }}>
                Envíos a todo el país · Transferencia · MercadoPago · MODO
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          div::-webkit-scrollbar       { width: 3px; }
          div::-webkit-scrollbar-track { background: transparent; }
          div::-webkit-scrollbar-thumb { background: rgba(92,53,32,0.28); border-radius: 2px; }
          div::-webkit-scrollbar-thumb:hover { background: rgba(92,53,32,0.48); }
        `}</style>
      </motion.div>
    </>
  )
}
