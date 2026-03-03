'use client'

import { useState, useEffect, useCallback } from 'react'
import type { OrderComplete, UpdateOrderPayload } from '@/backend/features/orders/models/order.model'

export function useOrders() {
  const [orders, setOrders] = useState<OrderComplete[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data.orders ?? [])
      setLastUpdated(new Date())
    } catch (err) {
      console.error('[useOrders] fetch error:', err)
    } finally {
      if (!silent) setIsLoading(false)
    }
  }, [])

  const updateOrder = useCallback(async (id: number, payload: UpdateOrderPayload) => {
    // Optimistic update for instant UI feedback (e.g. "Por Despachar" count)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...payload } : o))
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      fetchOrders(true) // silent refresh without loading spinner
    }
    return res.ok
  }, [fetchOrders])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  return { orders, isLoading, lastUpdated, refresh: fetchOrders, updateOrder }
}
