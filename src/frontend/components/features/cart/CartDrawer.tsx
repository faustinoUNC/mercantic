'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/frontend/context/CartContext'

const COLOR_LABELS: Record<string, string> = { negro: 'Negro', oxido: 'Óxido' }

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart()

  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 101,
        width: 'min(420px, 100vw)',
        background: '#120a04',
        borderLeft: '1px solid rgba(92, 53, 32, 0.4)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(92, 53, 32, 0.3)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={20} style={{ color: '#c4622d' }} />
            <span style={{ color: '#f5e6d3', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em' }}>
              Mi Carrito
            </span>
            {itemCount > 0 && (
              <span style={{
                background: 'rgba(196, 98, 45, 0.2)',
                border: '1px solid rgba(196, 98, 45, 0.3)',
                color: '#c4a882', fontSize: '0.75rem',
                padding: '1px 8px', borderRadius: '100px',
              }}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a5c44', padding: '4px' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f5e6d3'}
            onMouseLeave={e => e.currentTarget.style.color = '#7a5c44'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', padding: '3rem 0' }}>
              <ShoppingBag size={48} style={{ color: '#3d2415', opacity: 0.5 }} />
              <p style={{ color: '#5c3520', textAlign: 'center', fontSize: '0.9rem' }}>
                Tu carrito está vacío.<br />
                <span style={{ fontSize: '0.82rem' }}>Explorá nuestros fogoneros.</span>
              </p>
              <Link
                href="/productos"
                onClick={onClose}
                style={{
                  color: '#c4622d', textDecoration: 'none', fontSize: '0.82rem',
                  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                  border: '1px solid rgba(196, 98, 45, 0.3)', padding: '0.5rem 1.25rem', borderRadius: '6px',
                }}
              >
                Ver Modelos
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => {
                const displayPrice = item.salePrice ?? item.price
                return (
                  <div key={item.variantId} style={{
                    background: 'rgba(45, 26, 14, 0.5)',
                    border: '1px solid rgba(92, 53, 32, 0.35)',
                    borderRadius: '10px',
                    padding: '1rem',
                  }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      {/* Product preview */}
                      <div style={{
                        width: '52px', height: '52px', flexShrink: 0,
                        borderRadius: '8px',
                        background: 'linear-gradient(145deg, #3d2415, #1a0f07)',
                        border: '1px solid rgba(196, 98, 45, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{
                          width: '26px', height: '26px',
                          borderRadius: '4px',
                          background: 'radial-gradient(circle, rgba(245,158,11,0.4), rgba(196,98,45,0.2), transparent)',
                          border: '1px solid rgba(196, 98, 45, 0.3)',
                        }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#f5e6d3', fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>
                          {item.productName}
                        </div>
                        <div style={{ color: '#7a5c44', fontSize: '0.75rem' }}>
                          {item.size} · {COLOR_LABELS[item.color] ?? item.color}
                        </div>
                        <div style={{ color: '#e8783a', fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' }}>
                          ${(displayPrice * item.quantity).toLocaleString('es-AR')}
                          {item.quantity > 1 && (
                            <span style={{ color: '#5c3520', fontSize: '0.75rem', fontWeight: 400, marginLeft: '4px' }}>
                              (${displayPrice.toLocaleString('es-AR')} c/u)
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c3520', padding: '2px', flexShrink: 0 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#5c3520'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          background: 'rgba(92, 53, 32, 0.3)',
                          border: '1px solid rgba(92, 53, 32, 0.4)',
                          cursor: 'pointer', color: '#c4a882',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ color: '#f5e6d3', fontWeight: 600, fontSize: '0.9rem', minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          background: 'rgba(92, 53, 32, 0.3)',
                          border: '1px solid rgba(92, 53, 32, 0.4)',
                          cursor: 'pointer', color: '#c4a882',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid rgba(92, 53, 32, 0.3)',
            flexShrink: 0,
            background: 'rgba(15, 7, 2, 0.8)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: '#7a5c44', fontSize: '0.85rem' }}>Subtotal</span>
              <span style={{ color: '#f5e6d3', fontWeight: 700, fontSize: '1rem' }}>
                ${subtotal.toLocaleString('es-AR')} ARS
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              style={{
                display: 'block', textAlign: 'center',
                background: 'linear-gradient(135deg, #c4622d, #e8783a)',
                color: '#f5e6d3', padding: '0.9rem',
                borderRadius: '8px', textDecoration: 'none',
                fontWeight: 700, fontSize: '0.9rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                boxShadow: '0 0 24px rgba(196, 98, 45, 0.3)',
              }}
            >
              Ir a pagar
            </Link>
            <p style={{ color: '#3d2415', fontSize: '0.72rem', textAlign: 'center', marginTop: '0.75rem' }}>
              Envíos a todo el país · Transferencia · MercadoPago · MODO
            </p>
          </div>
        )}
      </div>
    </>
  )
}
