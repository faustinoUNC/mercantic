'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/frontend/context/CartContext'
import { useState } from 'react'
import { CartDrawer } from './CartDrawer'

export function CartButton() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Carrito (${itemCount} items)`}
        style={{
          position: 'relative',
          background: 'none',
          border: '1px solid rgba(196, 98, 45, 0.35)',
          borderRadius: '6px',
          cursor: 'pointer',
          color: '#c4a882',
          padding: '0.45rem 0.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(196, 98, 45, 0.7)'
          e.currentTarget.style.color = '#e8783a'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(196, 98, 45, 0.35)'
          e.currentTarget.style.color = '#c4a882'
        }}
      >
        <ShoppingBag size={20} />
        {itemCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: 'linear-gradient(135deg, #c4622d, #e8783a)',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 700,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px rgba(196, 98, 45, 0.6)',
          }}>
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
