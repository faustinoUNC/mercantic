'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/frontend/context/CartContext'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CartDrawer } from './CartDrawer'

export function CartButton() {
  const { itemCount } = useCart()
  const [open, setOpen]   = useState(false)
  const [hov, setHov]     = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        whileTap={{ scale: 0.91 }}
        aria-label={`Carrito (${itemCount} items)`}
        style={{
          position:     'relative',
          background:   hov ? 'rgba(196,98,45,0.1)' : 'none',
          border:       `1px solid ${hov ? 'rgba(196,98,45,0.6)' : 'rgba(196,98,45,0.32)'}`,
          borderRadius: '7px',
          cursor:       'pointer',
          color:        hov ? '#e8783a' : '#b07a54',
          padding:      '0.45rem 0.6rem',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          transition:   'all 0.22s ease',
          boxShadow:    hov ? '0 0 18px rgba(196,98,45,0.14)' : 'none',
        }}
      >
        <motion.div
          animate={{ rotate: hov ? -8 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        >
          <ShoppingBag size={19} />
        </motion.div>

        <AnimatePresence mode="popLayout">
          {itemCount > 0 && (
            <motion.span
              key={itemCount}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 460, damping: 20 }}
              style={{
                position:     'absolute',
                top:          '-7px',
                right:        '-7px',
                background:   'linear-gradient(135deg, #c4622d, #e8783a)',
                color:        'white',
                fontSize:     '0.58rem',
                fontWeight:   800,
                width:        '18px',
                height:       '18px',
                borderRadius: '50%',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                boxShadow:    '0 0 12px rgba(196,98,45,0.7), 0 0 0 2px #0f0702',
                letterSpacing: '-0.02em',
                lineHeight:   1,
              }}
            >
              {itemCount > 9 ? '9+' : itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
