'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Flame, LogOut, ShoppingBag, BarChart3, Package, Tag } from 'lucide-react'
import { OrdersTable } from '@/frontend/components/features/admin/OrdersTable'
import { GeneralStats } from '@/frontend/components/features/admin/GeneralStats'
import { ProductManager } from '@/frontend/components/features/admin/ProductManager'
import { DiscountManager } from '@/frontend/components/features/admin/DiscountManager'

type Tab = 'orders' | 'stats' | 'products' | 'discounts'

const TABS: { id: Tab; label: string; icon: typeof ShoppingBag }[] = [
  { id: 'orders',    label: 'Pedidos',        icon: ShoppingBag },
  { id: 'stats',     label: 'Estadísticas',   icon: BarChart3   },
  { id: 'products',  label: 'Productos',      icon: Package     },
  { id: 'discounts', label: 'Descuentos',     icon: Tag         },
]

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('orders')
  const [newOrders, setNewOrders] = useState(0)

  const handleNewOrdersCount = useCallback((n: number) => setNewOrders(n), [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div style={{
                width: 28, height: 28,
                background: 'radial-gradient(circle at 50% 70%, #e8783a, #c4622d, #3d2415)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 10px rgba(232, 120, 58, 0.4)',
              }}>
                <Flame size={13} color="#f5e6d3" fill="#f5e6d3" />
              </div>
              <span className="font-display font-bold text-foreground">El Mercantic</span>
              <span className="text-muted-foreground text-sm hidden sm:inline">· Panel Admin</span>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold">Panel Administrativo</h1>
            <p className="text-muted-foreground text-sm">Gestión de pedidos, estadísticas y productos</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b overflow-x-auto pb-px">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setTab(id); if (id === 'orders') setNewOrders(0) }}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  tab === id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {id === 'orders' && newOrders > 0 && (
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                    <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-amber-500 text-white text-[10px] font-bold leading-none">
                      {newOrders > 9 ? '9+' : newOrders}
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'orders'    && <OrdersTable onNewOrdersCount={handleNewOrdersCount} />}
          {tab === 'stats'     && <GeneralStats />}
          {tab === 'products'  && <ProductManager />}
          {tab === 'discounts' && <DiscountManager />}
        </main>
      </div>
    </TooltipProvider>
  )
}
