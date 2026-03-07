'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { OrderComplete, UpdateOrderPayload } from '@/backend/features/orders/models/order.model'

export function useOrders() {
  const [orders, setOrders] = useState<OrderComplete[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const knownCountRef = useRef<number | null>(null)

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      const incoming: OrderComplete[] = data.orders ?? []

      // Detect new orders on subsequent polls
      if (knownCountRef.current !== null && incoming.length > knownCountRef.current) {
        setNewOrdersCount(prev => prev + (incoming.length - knownCountRef.current!))
      }
      knownCountRef.current = incoming.length

      setOrders(incoming)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('[useOrders] fetch error:', err)
    } finally {
      if (!silent) setIsLoading(false)
    }
  }, [])

  const updateOrder = useCallback(async (id: number, payload: UpdateOrderPayload) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...payload } : o))
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      fetchOrders(true)
    }
    return res.ok
  }, [fetchOrders])

  const clearNewOrders = useCallback(() => {
    setNewOrdersCount(0)
    knownCountRef.current = orders.length
  }, [orders.length])

  // Initial load
  useEffect(() => { fetchOrders() }, [fetchOrders])

  // Poll every 30s for new orders
  useEffect(() => {
    const interval = setInterval(() => fetchOrders(true), 30_000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  return { orders, isLoading, lastUpdated, newOrdersCount, clearNewOrders, refresh: fetchOrders, updateOrder }
}
